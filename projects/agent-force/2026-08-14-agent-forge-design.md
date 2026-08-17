# Agent Forge — Autonomous SWE Platform

**Date:** 2026-08-14
**Status:** Design approved, ready for implementation planning
**Author:** Solution architecture session

---

## 1. Purpose

Run an LLM-driven software engineer continuously on a self-hosted physical server. It
receives requirements authored by a BA in Rally, decomposes them into specifications
and tasks using GitHub spec-kit, implements them in isolated workspaces, verifies its
own work against real test execution, and opens pull requests for human review.

Two human checkpoints exist per feature. Everything between them is automated.

**Non-goals:**

- Replacing human judgment on product intent (Epics and Features remain human-authored).
- Auto-merging to `main` without review.
- Running a local open-weight model. The platform calls a hosted model API.

---

## 2. Key decisions

| Decision | Choice | Rationale |
|---|---|---|
| Model | GLM (Max tier) via Anthropic-compatible endpoint | Already owned; subscription pricing; no GPU needed |
| Agent runtime | Claude Code CLI, headless (`claude -p`) | Tool use, context management, MCP, hooks, permissions already solved |
| Orchestration | Custom deterministic orchestrator (Python) | State machine must be crash-safe and testable; non-determinism confined to subprocesses |
| Spec method | GitHub spec-kit (`/specify`, `/plan`, `/tasks`) | Converts prose requirements into machine-checkable artifacts |
| Work tracker | Existing Rally clone (self-built) | Already the team's tool; BA and QA workflows unchanged |
| Git host | GitHub, with self-hosted Actions runner | Branch protection is the real enforcement of the merge gate |
| Autonomy | Two human gates: design approval, merge approval | ~90% automated while keeping correctness under human control |
| Concurrency | One agent slot per project; 2–3 projects in parallel | Eliminates intra-project merge conflicts; parallelism across projects |
| Agent lifetime | Persistent identity, ephemeral context | Avoids context rot; continuity lives in on-disk project memory |
| Crash recovery | Task-commit checkpoints pushed to GitHub after every task | Makes the worktree a disposable cache; a crash costs one task, never a story |
| Quality enforcement | Mechanical checks first, reviewer agents second | Deterministic rules cannot be argued around; agent self-review is the weakest possible check |
| Story scheduling | Explicit dependency graph, topological order | Independent stories proceed while a dependent one waits at a gate; otherwise one slow gate stalls a whole feature |
| Definition of done | After staging deployment and smoke tests, not at merge | A merged change is unverified in a running system |
| Network containment | Container-level egress allowlist | A tool-use hook cannot restrain code executed by a dependency's install script |
| Model selection | Tiered routing: cheap model for mechanical phases | Roughly a quarter of total tokens are spent on work that does not need the strongest model |
| Queue and locks | Postgres only — no Redis, no Celery | The `jobs` table is already the queue; a second broker creates a competing authority on what runs next, which crash recovery cannot reconcile |
| Implementation language | Python | Performance is irrelevant at 0.01 requests per second; iteration speed and library fit decide (§17.3) |
| Container runtime | Rootless Podman | The platform runs model-generated code continuously; no root daemon |
| Dashboard | Server-rendered HTMX, plus a 2D pixel "office" status view | Single-user internal tool; the pixel view is ambient status only, never the working interface |
| spec-kit usage | Subset: constitution, specify, clarify, checklist, analyze, plan, tasks — **not** `implement` | `implement` runs the loop agent-side, surrendering checkpointing, orchestrator-run verification, and per-task context freshness (§7.2.1) |
| Rules enforcement | Every required constitution clause mirrored as a mechanical check | Prose is followed *usually*; across hundreds of unattended runs that is not a guarantee (§8.3) |
| Repository onboarding | Explicit gated workflow; rules derived from the code as it is | Aspirational rules on day one fail every pull request and stall the platform (§8.2) |

### Rejected alternatives

- **Custom agent loop on raw SDK.** Full control, but requires rebuilding tool use,
  context compaction, permissions, and spec-kit integration. Not justified by any
  requirement identified.
- **Off-the-shelf platform (GitHub Actions agent action, OpenHands).** Fast to start,
  but cannot express the Epic→Feature→Story→Task hierarchy, has no per-project memory,
  and offers weak gate enforcement.
- **Local open-weight model on GPU.** Requires significant hardware and yields weaker
  coding quality than the already-owned GLM subscription.
- **Long-lived agent process per project.** Suffers context rot, loses all work on
  crash, and re-sends a growing context on every turn.

---

## 3. Topology

```
┌─────────────────── physical server (Linux) ────────────────────┐
│                                                                │
│  CONTROL PLANE (never executes agent-generated code)           │
│   ├─ Rally instance (pinned)      :8080   ← BA / QA            │
│   ├─ Orchestrator (Python)        :9000   ← state machine      │
│   ├─ Postgres  :5432   state + queue + locks + LISTEN/NOTIFY   │
│   ├─ Dashboard :3000   office view + ops view                  │
│   ├─ Egress proxy :3128  domain allowlist for slots            │
│   └─ GitHub Actions self-hosted runner                         │
│                                                                │
│  DATA PLANE (disposable, one per active slot; no default route)│
│   ├─ slot-1: worktree + container + ephemeral DB + dev ports   │
│   ├─ slot-2: ...                                               │
│   └─ slot-3: ...                                               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
        ↕ GitHub (repos, PRs, branch protection, CI)
        ↕ GLM API (z.ai) via ANTHROPIC_BASE_URL
```

**Invariant:** the control plane never runs agent-generated code. Agent code executes
only inside slot containers. A broken agent change destroys a slot, never the platform.

**Corollary:** the Rally instance used as the control plane is pinned and is never
deployed by an agent, even when the agent is working on the Rally codebase itself.
Agent work on Rally deploys to staging only; promotion to the control-plane instance
is a manual human action.

---

## 4. Work hierarchy

| Rally level | Owner | Produced artifact |
|---|---|---|
| Epic | Human | Business intent |
| Feature | Human (BA) | Requirement + acceptance criteria — **intake unit** |
| User Story | Agent (planner, `/specify`) | `spec.md`, design, ACs — **GATE 1** |
| Task | Agent (story worker, `/plan` + `/tasks`) | One commit each |
| Defect | QA | Fast lane, see §7.4 |

**Pull request granularity is the User Story**, not the Task. A task-level PR
("add a database column") cannot be reviewed in isolation and would flood the
reviewer. A story PR is coherent and maps to a set of acceptance criteria. Tasks
become commits inside that PR.

Tasks within a story run **serially** in one worktree. Tasks touch overlapping files;
running them in parallel produces conflicts and denies each agent the full picture.
Parallelism belongs at the project level.

### 4.1 End-to-end flow

Two flows: repository onboarding, run once, and the feature loop, run continuously. The
onboarding flow is what makes the feature loop enforceable, because it is where prose
rules become mechanical ones.

```
ONBOARDING — once per repository, human-gated (§8.2)
──────────────────────────────────────────────────────────────
  /speckit.constitution  ──▶ constitution.md      principles
  explore codebase       ──▶ ARCHITECTURE.md      structure as it IS
  derive rules           ──▶ dependency-cruiser   structure ENFORCED
  extract idioms         ──▶ PATTERNS.md
  snapshot metrics       ──▶ quality-baseline.json
                              │
                        human review + freeze
                              │
                         1–2 pilot stories
                              │
                        projects.enabled = true
                              ▼

FEATURE LOOP — continuous
──────────────────────────────────────────────────────────────
  BA writes Feature in Rally, labels ai-ready
        │
        ▼  readiness validator (deterministic, zero tokens)   §5.1
        │      fails ──▶ Rally comment, never reaches an agent
        ▼
  PLANNER   specify → clarify → checklist → analyze           §7.2.1
        │      ambiguity ──▶ Rally question ──▶ BLOCKED_ON_HUMAN
        ▼
  ══ GATE 1 ══  human approves spec PR: are the ACs right and complete?
        │
        ▼  stories spawned, ordered by depends_on             §11.4a
  STORY WORKER
        │  plan → tasks → draft PR opened immediately         §7.3.1
        │
        │  ┌── per task, fresh context ────────────────────┐
        │  │  acceptance tests first, then locked          │  §15.1
        │  │  agent implements                             │
        │  │  ORCHESTRATOR runs scoped tests               │  §15.4
        │  │  green ⇒ commit + push  ⇒  resume point       │  §14.1
        │  └───────────────────────────────────────────────┘
        ▼
  VERIFY   full suite, traceability, fitness functions,
           coverage, mutation, suppression delta, ratchet    §15.2
        ▼
  REVIEW PANEL  conformance / architecture / adversarial     §15.3
        │       blocking findings ──▶ REVIEW_FIX ──▶ VERIFY
        ▼
  ══ GATE 2 ══  human reviews PR: AC checklist + evidence prepared
        │
        ▼  merge
  STAGING_VERIFY   deploy + smoke + E2E                      §7.0
        │      fail ──▶ automatic revert PR ──▶ REVERT_OPEN
        ▼
  DONE   ──▶ review comments distilled into PATTERNS.md      §15.6
```

Human touches per feature: the Feature itself, GATE 1, and GATE 2. Everything else runs
unattended.

---

## 5. Components

### 5.1 Orchestrator (Python 3.12, FastAPI + APScheduler)

Deterministic. Contains no LLM calls. Modules:

- **intake** — polls Rally REST every 30 s for Features and Defects labelled
  `ai-ready`; creates jobs (deduplicated, see §11). Runs a **deterministic readiness
  validator** first: required fields present, acceptance criteria parseable, affected
  area named. A Feature that fails validation is rejected with a Rally comment listing
  the missing fields and never reaches an agent. This check costs no tokens and prevents
  the most expensive failure mode in the system.
- **router** — selects the model tier for each run (§16.2).
- **scheduler** — assigns jobs to free slots, honours the per-project mutex and the
  global model-API semaphore.
- **runner** — spawns `claude -p` subprocesses, streams `stream-json` output, enforces
  turn / token / wallclock budgets, parses the agent's result JSON.
- **gatekeeper** — reconciles Rally approval fields and GitHub PR review state into
  job state transitions.
- **reaper** — kills over-budget runs, destroys orphaned worktrees and slots, releases
  expired leases, enforces disk watermarks.
- **ledger** — records tokens, duration, exit reason, and cost attribution per run.

### 5.2 Agent runtime

Each agent invocation is a fresh subprocess:

```bash
claude -p "$PROMPT" \
  --output-format stream-json \
  --permission-mode acceptEdits \
  --allowed-tools "Read,Edit,Write,Bash,Glob,Grep,mcp__rally" \
  --mcp-config /slots/$SLOT/mcp.json \
  --settings /slots/$SLOT/settings.json \
  --max-turns 120
```

Environment: `ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic`,
`ANTHROPIC_AUTH_TOKEN=$GLM_KEY`.

The model is a configuration value. Swapping providers requires no code change.

### 5.3 Rally MCP server (stdio)

Gives the agent domain access during a run:

- `rally_get_item(id)` — description, ACs, attachments
- `rally_get_children(id)`
- `rally_get_comments(id)` — clarification thread
- `rally_post_comment(id, text)` — progress, and questions to the BA. Rate-limited to
  phase transitions and genuine questions; per-task commentary would bury the BA in
  noise and train them to ignore the feed.
- `rally_create_story(...)`, `rally_create_task(...)` — with idempotency key
- `rally_set_state(id, state)` — advisory only; authoritative state lives in Postgres
- `rally_link_pr(id, url)`

**Division of responsibility:** MCP is the agent's data plane (read and write domain
data). REST is the orchestrator's control plane (state transitions, gates). MCP calls
are model-decided and may silently fail; the state machine must never depend on them.

### 5.4 Slot manager

Allocates, per active slot: a git worktree, a Podman Compose project, a port range, and
an ephemeral seeded Postgres instance. Destroys all of it when the run ends.

### 5.5 Dashboard (server-rendered, SSE)

Read-only over Postgres, plus gate decision actions. See §9.

---

## 6. Data model

```sql
projects (
  id, name, repo_url, default_branch,
  rally_project_id, slot_profile, memory_path,
  speckit_version,                 -- pinned; upgrades are reviewed changes (§7.2.1)
  onboarded_at, pilot_stories_done,
  max_concurrent DEFAULT 1, enabled
)

jobs (
  id, project_id, kind,            -- 'feature_plan' | 'story_impl' | 'defect_fix'
  rally_item_id, parent_job_id,
  state, state_version, state_since,
  branch, pr_url, worktree_path,
  last_commit_sha,                 -- resume anchor: last green task commit
  task_plan JSONB,                 -- ordered tasks from /tasks
  last_completed_task INT DEFAULT -1,
  attempt_count DEFAULT 0, max_attempts DEFAULT 3,
  crash_count DEFAULT 0,           -- distinct from attempt_count; poison-task guard
  token_budget, tokens_used, token_estimate,
  affected_modules JSONB,
  depends_on JSONB,                -- sibling job ids that must reach DONE first
  priority INT DEFAULT 100,        -- claim ordering, §11.4a
  slot_id, lease_token,            -- set on claim; fencing, §14.5
  context_prefix_path,             -- frozen per-story context, reused by every task
  staging_url, staging_verified_at,
  blocked_reason, created_at, updated_at
)

runs (                              -- one `claude -p` invocation
  id, job_id, phase,               -- specify|plan|tasks|implement|verify|review_fix
  task_index, started_at, ended_at,
  pid, slot_id, lease_token,       -- for zombie detection and fencing
  heartbeat_at,                    -- written every 10 s by the runner
  exit_code, exit_reason,          -- ok|max_turns|timeout|budget|crash|guardrail
  model_id, model_tier,            -- 'cheap' | 'strong'; see §16.2
  prompt_template_version,         -- so metrics remain comparable across prompt changes
  input_tokens, output_tokens, cache_read_tokens,
  turns_used, tests_run, tests_passed, files_changed_count, loc_delta,
  transcript_path, summary
)

flaky_tests (
  id, project_id, test_id, first_seen_at, last_seen_at,
  occurrences, quarantined, rally_defect_id
)

golden_tasks (                      -- platform regression harness, §15.9
  id, name, repo_ref, spec_path, expected_outcome_json, enabled
)

golden_runs (
  id, golden_task_id, run_at, prompt_template_version, model_id,
  passed, score_json
)

gates (
  id, job_id, gate_type,           -- 'design' | 'merge' | 'defect_repro'
  requested_at, decided_at, decided_by,
  decision,                        -- approved|rejected|changes_requested
  feedback_text
)

slots (
  id, name, status, job_id, port_base,
  lease_token, heartbeat_at
)

external_refs (                     -- idempotency for external side effects
  job_id, kind, external_id, created_at,
  PRIMARY KEY (job_id, kind)
)

outbox (                            -- transactional side-effect delivery
  id, job_id, target,              -- 'rally' | 'github'
  payload_json, idempotency_key,
  state, attempts, created_at, sent_at
)

events (                            -- append-only audit, monthly partitions
  id, job_id, run_id, ts, level, type, payload_json
)
```

`jobs` is the single source of truth. An orchestrator restart reconciles entirely from
this table.

**Indexes:** `jobs(state, project_id)`, `runs(job_id)`, partial unique index on active
jobs (§11.1), `events` partitioned by month.

---

## 7. State machine

```
                    ┌──────────┐
                    │   NEW    │  intake created job from Rally Feature
                    └────┬─────┘
                         ▼
                  ┌─────────────┐
                  │  PLANNING   │  planner agent: /specify → stories + ACs + design
                  └──────┬──────┘
                         ▼
              ┌──────────────────────┐
              │ AWAIT_DESIGN_APPROVAL│  ◄── GATE 1 (human)
              └───┬──────────────┬───┘
         rejected │              │ approved
                  ▼              ▼
            ┌──────────┐   ┌───────────┐
            │ PLANNING │   │ SPAWNING  │  create child story_impl jobs
            │ (revise) │   └─────┬─────┘
            └──────────┘         ▼
                          ┌─────────────┐
                          │   QUEUED    │  waiting for project slot
                          └──────┬──────┘
                                 ▼
                          ┌─────────────┐
                          │IMPLEMENTING │  /plan → /tasks → serial task loop
                          └──────┬──────┘
                                 ▼
                          ┌─────────────┐
                          │  VERIFYING  │  full suite + lint + typecheck + build
                          └──┬───────┬──┘
                     fail    │       │  pass
                             ▼       ▼
                    ┌─────────────┐  ┌──────────────┐
                    │IMPLEMENTING │  │ AWAIT_MERGE  │ ◄── GATE 2 (PR review)
                    │ (attempt+1) │  └──┬────────┬──┘
                    └──────┬──────┘     │        │
                  attempts │   changes  │        │ approved + merged
                  exceeded │  requested │        ▼
                           ▼            ▼    ┌────────┐
                     ┌──────────┐  ┌──────────────┐ │STAGING_ │
                     │ BLOCKED  │  │  REVIEW_FIX  │ │ VERIFY  │
                     └──────────┘  └──────┬───────┘ └──┬───┬──┘
                           ▲              │      fail  │   │ pass
                           │              └──► VERIFYING   │
                     ┌─────┴────────────┐        ▼         ▼
                     │ BLOCKED_ON_HUMAN │  ┌────────────┐ ┌──────┐
                     └──────────────────┘  │REVERT_OPEN │ │ DONE │
                                           └────────────┘ └──────┘
```

Terminal states: `DONE`, `CANCELLED`. Halting states requiring human action:
`BLOCKED`, `BLOCKED_ON_HUMAN`, `AWAIT_DESIGN_APPROVAL`, `AWAIT_MERGE`, `REVERT_OPEN`.

### 7.0 Post-merge verification

A merged change is not a verified change. On merge the job enters `STAGING_VERIFY`: the
default branch is deployed to staging and the smoke and end-to-end suites run against
the deployed application.

- **Pass:** job → `DONE`, `staging_verified_at` recorded.
- **Fail:** the orchestrator opens a revert pull request automatically, sets
  `REVERT_OPEN`, and alerts a human. It never merges the revert itself — reverting is a
  human decision.

Without this step, continuous integration is the last line of defence, and it is not
strong enough to be.

State is written **only** by the orchestrator, inside a Postgres transaction, using
optimistic concurrency (§11.3). The agent never writes job state; it returns a
structured result and the orchestrator decides.

### 7.1 Agent result contract

Every run's final output must be a single JSON object:

```json
{
  "status": "ok | blocked | failed",
  "summary": "...",
  "questions": ["..."],
  "files_changed": ["..."],
  "tests_added": ["..."],
  "new_dependencies": [{"name": "...", "reason": "..."}]
}
```

Unparseable output is treated as `failed` and increments `attempt_count`.

### 7.2 Planner run (Feature → Stories)

Input: Feature description and ACs, project memory files, read-only repo checkout.

1. Read the Feature and its comment thread via Rally MCP.
2. If required fields are missing or ambiguous, post specific questions as a Rally
   comment and return `blocked`. Do not guess.
3. Run spec-kit `/speckit.specify`, producing `specs/<feature-slug>/spec.md`, then the
   quality gates in §7.2.1.
4. Split into User Stories, each with: goal, identified Given/When/Then acceptance
   criteria (`AC-1 … AC-n`), affected modules, explicit out-of-scope, risk notes, and
   `depends_on` listing sibling stories that must merge first.
5. Create the Stories in Rally and attach the spec.
6. Commit the spec on branch `spec/<feature-slug>` and open a **draft PR**. This PR is
   the GATE 1 review surface.
7. Return `ok`.

**Story size cap.** A story must not exceed 8 tasks or roughly 400 estimated lines
changed. The orchestrator rejects an oversized story and requires the planner to split
it. An unreviewable pull request causes the human to approve without reading, which
removes the value of GATE 2 entirely.

**Dependency graph.** `depends_on` is mandatory output. The scheduler runs stories in
topological order: a story with no unmet dependencies branches from the default branch
and proceeds immediately, even while a sibling waits at a gate. Only genuinely dependent
stories wait for their predecessor to reach `DONE`. Without this, a single slow gate
stalls an entire feature.

**Rejection is incremental, not a restart.** GATE 1 rejection re-runs the planner with
the reviewer's feedback, preserving stories the reviewer accepted and revising only what
was rejected. Regenerating the whole plan wastes tokens and discards good work.

#### 7.2.1 spec-kit command selection

spec-kit provides `constitution`, `specify`, `clarify`, `plan`, `checklist`, `tasks`,
`analyze`, `implement`, and `converge`, plus a bug extension (`assess`, `fix`,
`validate`). This design uses a deliberate subset.

| Command | Used | Where and why |
|---|---|---|
| `constitution` | Yes | Once per repository at onboarding (§8.2) |
| `specify` | Yes | Feature → stories and acceptance criteria |
| `clarify` | Yes | Ambiguity resolution before planning — the highest-value addition |
| `checklist` | Yes, tiered | Only for domains the story's `affected_modules` touch |
| `analyze` | Yes | Consistency check across spec, plan, and tasks, before GATE 1 |
| `plan`, `tasks` | Yes | Story → ordered task list |
| `implement` | **No** | Conflicts with the orchestrated task loop — see below |
| `converge` | Deferred | Evaluate in Phase 3; do not assume compatibility |
| Bug extension | Deferred | Evaluate against §7.4; adopt only if `validate` can be driven by the orchestrator's test run rather than agent self-report |

**`/speckit.implement` is deliberately not used.** It runs the full implementation loop
agent-side, which would surrender the three properties the orchestrated loop exists to
provide: task-commit checkpointing and resume (§14), orchestrator-run verification rather
than agent self-report (§15.4), and fresh context per task (§16.1). The output of
`/speckit.tasks` is consumed as input to the loop in §7.3 instead.

**`/speckit.clarify` requires headless adaptation.** It is designed for interactive
terminal question-and-answer. Run non-interactively it must **emit its questions as data**
rather than block on standard input; the orchestrator routes them to a Rally comment and
sets `BLOCKED_ON_HUMAN`. Without this adaptation every planner run hangs until the reaper
kills it on wallclock.

**Command templates are forked and versioned.** Stock `specify` does not emit acceptance
criteria identifiers, `depends_on`, or `token_estimate`, and does not respect the story
size cap — all of which this design depends on. The templates are treated as first-class
source code in the repository, reviewed like any other change.

**The spec-kit version is pinned.** The toolkit moves quickly, and an unpinned upgrade
would silently change agent behaviour on a system that runs unattended. An upgrade is a
reviewed change: bump the pin, run the golden harness (§15.9), compare pass rates, then
adopt.

Cost note: every command is an agent run. `clarify` and `analyze` per feature are cheap
against the cost of one bad specification. `checklist` across every domain on every story
is not, hence the tiering.

Resulting pipeline:

```
constitution        once per repo, then frozen        (§8.2)
      ▼
specify             feature → stories, AC ids, depends_on
      ▼
clarify             questions → Rally → BLOCKED_ON_HUMAN if unresolved
      ▼
checklist           only domains the story touches
      ▼
analyze             spec / plan / tasks consistency
      ▼
── GATE 1 ──        human approves the spec PR
      ▼
plan → tasks        ordered task list
      ▼
orchestrated loop   §7.3 — not /speckit.implement
```

### 7.3 Story worker (Story → PR)

1. Acquire the project mutex; allocate a slot.
2. `git worktree add /slots/N/wt -b feat/<story-id>-<slug> origin/<default_branch>`.
3. Start the slot container: install dependencies, run migrations, seed the ephemeral
   database.
4. Run `/plan` → `plan.md`; `/tasks` → `tasks.md` (ordered, each task scoped to a small
   file group). Persist the ordered list to `jobs.task_plan`.
5. Create Task items in Rally for BA visibility. Push the branch and open a **draft
   PR immediately** (see §7.3.1).
6. **Serial task loop:**
   ```
   for i, task in enumerate(tasks) starting at jobs.last_completed_task + 1:
       for attempt in 1..3:
           fresh `claude -p` run
           context = memory + spec + plan + this task + last failure output
           agent: write failing test → implement → self-check
           ORCHESTRATOR runs the scoped tests (agent's claim is ignored)
           if green:
               git commit -m "<task title>"
               git push origin HEAD                      # checkpoint offsite
               jobs.last_commit_sha = HEAD
               jobs.last_completed_task = i
               break
       if still red: job → BLOCKED; dump transcript; stop
   ```
7. Full verification: entire test suite, lint, typecheck, build, migration up and down.
8. Mark the PR ready for review. Body contains: spec link, AC checklist, tasks
   completed, test summary, files changed, token cost.
9. `rally_link_pr`; Story state → `AWAIT_MERGE`.
10. Release the slot but **retain the worktree** — review fixes need it. The worktree is
    a cache only; losing it costs nothing (§7.3.1).

#### 7.3.1 Offsite checkpointing

The draft PR is opened before the first task, and the branch is pushed after **every**
green task commit rather than once at the end.

Consequences:

- The git worktree becomes a pure cache. If the slot wedges, the disk fills, or the
  whole server is rebuilt, the branch is recovered by cloning from GitHub and work
  resumes at `last_completed_task + 1`.
- Progress is visible in the PR while the agent is still working.
- The cost is one extra push per task.

This property is what makes crash recovery (§14) uneventful. It depends on the
invariant that **no commit is ever created from non-green code**: the orchestrator runs
the scoped tests itself before committing, so every commit on the branch is a valid
resume point.

At GATE 2: approval and merge move the job to `DONE`, the agent appends a
`DECISIONS.md` entry, and the worktree is destroyed. "Changes requested" causes the
orchestrator to feed the review comments into a `REVIEW_FIX` run, which returns to
`VERIFYING`.

### 7.4 Defect lane

Defects with reproduction steps skip GATE 1:

```
Defect → agent writes a failing test reproducing the defect
       → GATE (cheap): human confirms the test captures the bug
       → agent fixes until green → PR → GATE 2
```

A defect without reproduction steps causes the agent to post a Rally comment asking QA
and set `BLOCKED_ON_HUMAN`.

### 7.5 Task agent prompt skeleton

```
You are implementing ONE task. Do not do more.

## Project rules
<constitution.md>
## Architecture
<ARCHITECTURE.md excerpt for the affected modules>
## Story spec and acceptance criteria
<spec.md>
## Plan
<plan.md>
## Your task
<task N of M>
## Previous attempt failure (if any)
<test output>

Rules:
- Write the test FIRST. It must fail before you implement.
- Do not modify existing tests.
- Do not touch files outside: <allowlist>
- Do not add dependencies without stating the reason in the output JSON.
- When done, output the result JSON and nothing else.
```

---

## 8. Project memory and onboarding

### 8.1 The four files

Continuity across runs lives on disk, not in a process. Each project holds four files
with distinct scopes; conflating them is the common failure.

| File | Scope | Content | Agent may write | Enforced by |
|---|---|---|---|---|
| `constitution.md` | Repository | Non-negotiable principles, and why they exist | **No** | CI mirror (§8.3) |
| `ARCHITECTURE.md` | Repository | Module map, layer boundaries | On merge only | Fitness functions (§15.2) |
| `PATTERNS.md` | Repository | Naming, error handling, test style | On merge only | Lint rules, architecture reviewer |
| `DECISIONS.md` | Repository | Append-only: choice, alternatives, why, what failed | On merge only | Nothing — context only |

`constitution.md` follows the spec-kit convention and is deliberately short and abstract:
principles, not structure. Detailed module layout belongs in `ARCHITECTURE.md`, and
idioms in `PATTERNS.md`. Overloading the constitution with hundreds of lines of structural
detail raises the price of every run (§8.4) without improving compliance (§8.3).

The constitution is agent-read-only, enforced by a `PreToolUse` hook (§9). An agent able
to edit its own constraints has none.

Every run hydrates these files at the start and appends learnings at the end. This is
where the agent's accumulated judgement lives.

### 8.2 Repository onboarding

Adding a project is a distinct workflow, run once, with a human gate at the end. A
project is not eligible for continuous intake until it completes.

1. **`/speckit.constitution`** — establish principles. Human-reviewed and frozen.
2. **Architecture derivation** — an agent explores the existing codebase and writes
   `ARCHITECTURE.md` describing the structure **that is actually there**.
3. **Fitness function derivation** — translate the derived boundaries into executable
   rules (`.dependency-cruiser.yml` or `importlinter.ini`).
4. **Baseline capture** — snapshot current coverage, duplication, complexity,
   suppressions, and mutation score into `quality-baseline.json` (§15.5).
5. **Pattern extraction** — derive `PATTERNS.md` from existing idioms rather than
   inventing them.
6. **Human review** — all five artefacts reviewed and frozen together.
7. **Pilot** — one or two stories run end to end with heightened scrutiny before
   `projects.enabled` is set.

**Brownfield rule: derive rules from the code as it is, not as it ought to be.**
Aspirational layer rules written on day one fail every pull request, including correct
ones, and the platform stalls before it has delivered anything. Initial rules encode
current reality; the quality ratchet (§15.5) is the mechanism that moves the project
toward the intended state over time. The initial rules only have to be *true*.

### 8.3 Constitution clauses must be mirrored mechanically

A prose rule is read by the agent and usually followed. Across hundreds of unattended
runs, "usually" is not a guarantee, and drift is certain.

> **Every constitution clause that is actually required must have a mechanical
> counterpart.** The constitution states *why*; a fitness function or lint rule enforces
> *what*.

```
constitution.md   "The domain layer must not depend on infrastructure."
                            │  mirrored as
                            ▼
.dependency-cruiser.yml     domain → infra  ⇒  build failure
```

A clause with a mechanical counterpart is guaranteed. A clause without one is advice, and
partial compliance should be expected. When authoring a constitution, each clause is
tested with a single question: *what breaks the build if this is violated?* If there is no
answer, either mechanise the clause or accept that it is soft — but record which it is.

### 8.4 Bounded growth

`DECISIONS.md` and `PATTERNS.md` are append-only in spirit but must
be bounded in size: every task pays for their full length on every run, so unbounded
growth is a cost leak that compounds for as long as the platform runs. Each file is
capped at roughly 4,000 tokens. A monthly compaction run (cheap model tier) summarises
older entries, keeps superseded decisions as one-line records, and preserves anything
still referenced by an active rule.

Context ordering in the prompt is **stable-first** (constitution → architecture →
patterns → spec → plan → task → last error) so the stable prefix hits the provider's
prompt cache. This is the single largest cost lever in the system.

---

## 9. Guardrails

Prompt-level rules are the weakest layer. Enforcement is mechanical.

**Layer 1 — Claude Code hooks (`PreToolUse`), per-slot settings**

- Block `Edit`/`Write` outside the slot worktree path.
- Block writes to `.github/workflows/**`, `constitution.md`, `quality-baseline.json`,
  the fitness-rule configs, the forked spec-kit templates, `.env*`, and `settings.json`.
  An agent able to edit its own constraints has none.
- Block `Bash` matching `git push --force`, `git reset --hard origin/*`, `rm -rf /`,
  `podman`, `docker`, `gh pr merge`, and network calls to non-allowlisted hosts.
- Block edits to test files unless the job kind explicitly permits it.

**Layer 2 — Orchestrator**

- Runs all tests itself. The agent's "tests pass" claim is never trusted.
- Pre-commit diff scan: test-file changes, new dependencies, file count, LOC delta.
  Exceeding thresholds moves the job to `BLOCKED` and pings a human.
- Budgets: per-run token cap, per-job token cap, wallclock timeout, max 3 attempts per
  task.
- Rate limiting: exponential backoff with jitter on HTTP 429; sustained 429 pauses the
  queue and raises an alert.

**Layer 3 — CI (self-hosted runner)**

- Full test suite, lint, typecheck, build, migration reversibility.
- Coverage must not decrease.
- `test-guard` job: a PR that touches test files without the `test-change` label fails.
- Secret scanning with push protection.
- All of the above are required status checks.

**Layer 4 — GitHub branch protection on the default branch**

- Pull request required; CI green required; one approving review required.
- Force-push blocked; self-approval blocked.
- The agent's GitHub App token deliberately lacks the `workflow` scope, so it cannot
  modify CI to disable any of these checks.

**Layer 0 — Container egress allowlist**

Tool-use hooks operate on commands the agent issues directly. They cannot restrain code
executed by a dependency's post-install script, a test fixture, or a build plugin. Network
containment therefore has to sit below the agent, at the container boundary.

Slot containers are given **no default route to the internet**. All outbound HTTP and
HTTPS traffic goes through a forward proxy on the control plane (squid or equivalent),
injected as `HTTP_PROXY` and `HTTPS_PROXY`, which enforces a **domain allowlist**:

- the package registries the project needs (npm, PyPI),
- GitHub,
- the model API endpoint,
- the slot's own database and services (reached on the local network, not the proxy).

Everything else is refused at the proxy, and the container has no path around it. For
TLS, filtering is applied to the `CONNECT` target host.

A proxy is required rather than packet filtering because **iptables filters addresses,
not names**, and package registries sit behind CDNs with rotating addresses; an
address-based allowlist for npm or PyPI cannot be maintained.

This layer is listed first because it is the only one that holds when the agent is not
the process making the request.

**Dependency additions are blocking**

`new_dependencies` in the agent result contract is not advisory. Any dependency not on
the project's vetted allowlist moves the job to `BLOCKED` pending human approval, and an
approved package is added to the allowlist for future runs. An automated agent adding an
unreviewed package is the highest-severity supply-chain path in this design.

**Transcript redaction**

Transcripts are written to disk and rendered in the dashboard, and may contain
credentials, tokens, or customer data encountered during a run. A redaction pass runs on
write, before the line is persisted.

### Credential handling

- Use a GitHub App (or fine-grained PAT) scoped to the target repositories only, with
  `contents:write` and `pull_requests:write`. Never a classic `repo`-scoped token.
- Deny `workflow:write`.
- Tokens live in the orchestrator environment and are injected per run. They are never
  written into a worktree or a container image.

**Slot credentials.** Integration tests need credentials, and anything present in a slot
is readable by the agent — `env` is a legal command — and can reach a transcript or a
commit. Slots therefore receive only local, disposable credentials: the ephemeral
database, and mocked third-party services (WireMock or equivalent). No real third-party
API key is ever placed in a slot. A test that genuinely requires a live external service
runs outside the agent loop, in the staging verification stage (§7.0), where no agent is
present.

---

## 10. Retention and cleanup

| Artifact | Retention | Trigger |
|---|---|---|
| Worktree (merged) | Destroy immediately | PR merged |
| Worktree (blocked) | 7 days | Daily reaper |
| Worktree (orphan) | 1 hour | No live job row, or job terminal > 1 h |
| Slot container + ephemeral DB | Destroy at run end | Always ephemeral |
| Transcripts (successful runs) | 14 days, gzipped | Then deleted; DB summary retained |
| Transcripts (failed/blocked runs) | 90 days | Debugging value |
| `events` rows | 90 days hot | Drop monthly partition |
| `runs` rows | Raw 90 days; rolled-up metrics indefinitely | Nightly rollup job |
| Container images and layers | Weekly prune | Cron |
| Remote branches (merged) | Delete on merge | PR merge webhook |
| Remote branches (unmerged, 30 d idle) | Tag `archive/<name>`, then delete | Weekly |
| Specs, `DECISIONS.md` | Indefinite | Stored in git |

**Disk watermarks:** 80% warn → 90% pause intake and prune aggressively → 95% halt all
runs. A slot must never be able to fill the disk and wedge Postgres.

---

## 11. Concurrency, idempotency, and scale

The system assumes **at-least-once delivery** everywhere: pollers re-read, retries
occur, and the orchestrator may restart mid-flight. Every handler must be provably
idempotent.

### 11.1 Intake deduplication

```sql
CREATE UNIQUE INDEX jobs_active_uniq
  ON jobs (project_id, rally_item_id, kind)
  WHERE state NOT IN ('DONE','CANCELLED');
```

The Rally item id is the natural key. A repeated poll conflicts on insert and creates
no duplicate job.

### 11.2 Idempotent side effects

- **Branches** use a deterministic name, `feat/<story-id>-<slug>`; worktree creation
  checks for existence first.
- **Pull requests** are searched by `head:<branch>` before creation and reused if found.
- **Rally item creation** records `external_refs(job_id, kind, external_id)` in the same
  transaction; a retry looks up the mapping first.
- **All Rally and GitHub writes** use the outbox pattern: the intent row is committed in
  the same transaction as the state change, a sender worker delivers it with an
  idempotency key and marks it sent. A crash between commit and delivery replays safely.
- **GitHub webhooks** are deduplicated by `X-GitHub-Delivery`.

### 11.3 Safe state transitions

```sql
UPDATE jobs
   SET state = 'VERIFYING', state_version = state_version + 1
 WHERE id = $1 AND state = 'IMPLEMENTING' AND state_version = $2;
-- zero rows affected means another actor moved it: abort and re-read
```

### 11.4 Leases and locks

- **Slot lease:** `slots.lease_token` plus `slots.heartbeat_at`, renewed by the runner
  and expired by the reaper. The runner includes its fencing token on every state write;
  a zombie process holding a stale token is rejected, so it cannot corrupt a reassigned
  slot.
- **Project mutex:** `pg_advisory_lock` keyed `project:<id>`, held for the duration of a
  story. This guarantees serial execution within a project.

### 11.4a Dependency-aware scheduling

The scheduler selects the next runnable story as the one whose `depends_on` entries have
all reached `DONE`. Stories blocked on a gate do not block their independent siblings.
The dependency graph is validated for cycles when the planner's output is accepted; a
cycle rejects the plan back to the planner.

The queue is the `jobs` table itself; there is no separate broker. Claiming is a single
statement:

```sql
UPDATE jobs SET state='RUNNING', slot_id=$1, lease_token=$2
WHERE id = (
  SELECT id FROM jobs j
   WHERE j.state = 'QUEUED'
     AND NOT EXISTS (
       SELECT 1 FROM jobs d
        WHERE d.id = ANY(j.depends_on) AND d.state <> 'DONE')
   ORDER BY priority, created_at
   FOR UPDATE SKIP LOCKED
   LIMIT 1
) RETURNING *;
```

**No external task queue is used, and this is a correctness decision rather than a
throughput one.** The `jobs` table already holds state, dependencies, attempt counts, and
resume position. Introducing Celery or a Redis-backed broker would create a second
authority on what should run next, and after a crash the two can disagree — precisely the
condition §14 exists to eliminate. One authority means one reconciliation path.

Throughput is not a consideration: peak demand is roughly 36 jobs per hour, against a
`SKIP LOCKED` capacity of thousands per second.

**Transaction discipline.** A job is claimed in a short transaction and then executed
outside any transaction. Holding a transaction open for a ten-minute agent run would bloat
the table and stall autovacuum. This is the standard failure of database-backed queues and
is called out explicitly for that reason.

**Locks and leases** likewise need no external store: `pg_advisory_lock` provides the
project mutex, and the slot lease is the `lease_token` column plus `heartbeat_at`,
expired by the reaper (§14.5).

**Change notification** uses `LISTEN`/`NOTIFY`, carrying only a job id as a hint. Postgres
notifications are not durable — a notification raised while no listener is connected is
lost — so the payload is never treated as data. The dashboard re-reads state from the
database on receipt and on reconnect.

Redis becomes justified only if the platform spans multiple machines, exceeds roughly 100
jobs per second, or needs durable fan-out pub/sub. None of these is on the roadmap.

### 11.4b Cost ceilings

Each job carries `token_estimate`, produced by the planner. When `tokens_used` exceeds
twice the estimate, the job pauses in `BLOCKED` with reason `budget_exceeded` and asks a
human whether to continue or abandon. This bounds the damage a single pathological story
can do to a night's quota.

### 11.5 Parallelism model

- **v1:** parallel across projects, serial within a project. Three projects give three
  concurrent agents.
- **v2 (only if throughput demands it):** parallel stories within one project when their
  `affected_modules` sets are disjoint; any overlap queues. Do not build this until
  measurements show it is the bottleneck.

### 11.6 Global model-API semaphore

The provider rate limit is shared across every slot. A single counting semaphore caps
platform-wide in-flight requests independently of slot count. Without it, three slots
simply triple the 429 rate.

### 11.7 Performance

- Stable-prefix prompt ordering for cache hits (§8).
- Prebuilt slot container images with dependencies baked in.
- Shared pnpm and pip caches; `node_modules` volumes per project, not per run.
- Postgres indexes and monthly `events` partitioning as listed in §6.

---

## 12. Dashboard

Reads from Postgres; writes only gate decisions. Two views over one data source.

### 12.1 Two views, one endpoint

**Office view** — a 2D pixel-art floor plan in the style of Gather, intended as an
ambient status radiator readable at a glance from across the room:

| System concept | Representation |
|---|---|
| Project | A room |
| Slot | A desk |
| Active run | Avatar at the desk, typing |
| Current task | Speech bubble, "task 3 of 8" |
| `BLOCKED` | Avatar marked red, hand raised |
| `AWAIT_MERGE` | Stack of papers on the human's desk, with a count |
| `AWAIT_DESIGN_APPROVAL` | Second inbox tray, highlighted |
| `QUEUED` | Avatars seated in a waiting area |
| `STAGING_VERIFY` | Avatar walking to the deployment door |
| Quota consumption | Wall-mounted power meter |
| Flaky tests present | Flickering ceiling light |

**Ops view** — conventional dense HTML: tables, diffs, acceptance-criteria checklists,
test output, metrics.

**Rule: the office view is presentational only and is never the working interface.**
Approving a design or a merge requires reading a diff and a checklist, which pixel art
actively impedes. Clicking a figure in the office view opens the corresponding ops panel.

Both views render from the **same JSON endpoint**, so they cannot drift. No business
logic lives in the office view.

Implementation: a `<canvas>` driven by a vendored 2D sprite library (Kaplay or PixiJS),
fed by the same SSE stream. Update frequency is seconds to minutes and the scene holds
under a dozen sprites, so no build pipeline or framework is required — consistent with
the stack in §17. Assets are CC0 pixel tilesets with a deliberately tight palette.

### 12.2 Panels

**Live** — one card per slot: project, story, current task (e.g. 3 of 8), phase,
elapsed time, tokens consumed, tail of the transcript. Kill button.

**Queue** — pending jobs with priority and blocked reasons.

**Gates** — the primary working surface:
- *Design approvals*: rendered spec diff, AC list, Approve / Reject with feedback.
- *Merge approvals*: PR link, AC checklist, test summary, diff statistics.

**Progress** — Feature → Story → Task tree with live position ("task 3 of 8"), current
phase, elapsed time, and an ETA derived from the historical mean duration of that phase
for that project.

**Performance**
- Throughput: stories merged per day; mean cycle time broken down by phase. This
  breakdown usually shows most wall-clock time is spent waiting at the human gates,
  which is the number that should drive any decision to add slots.
- Quality: first-pass CI rate, average attempts per task, rework rate (PRs requiring
  changes), defect escape rate.

**Cost**
- Tokens per story; **cost per merged PR** (the return-on-investment figure).
- Quota percentage consumed, requests per minute, concurrency, 429 count.
- Cache-hit ratio (`cache_read_tokens` / `input_tokens`). This is the primary tunable
  cost lever, so it is displayed as a first-class metric rather than derived on demand.

**Reliability**
- Run crash rate, recovery events, tasks redone after a crash, mean time to recover,
  slot rebuild count, boot reconciliation outcomes.
- Flaky rate and quarantine list size (§15.8); staging verification failure rate; golden
  harness pass rate (§15.9).
- **Gate latency** — time spent in `AWAIT_DESIGN_APPROVAL` and `AWAIT_MERGE`, per gate.
  This is expected to dominate total cycle time and is the number that should drive any
  decision to add slots. Adding compute while gate latency is high produces a longer
  queue, not more delivered work.
- Without this panel a continuously running system can silently spend the night redoing
  the same work.

All metrics are stored as first-class columns on `runs` and `jobs` and aggregated by a
nightly rollup job. None are parsed out of log files.

**Timeline** — per-job event stream with transcript viewer and replay. Transcripts are
streamed to disk line by line as the run proceeds (§14.6), so the timeline is complete
even for a run that was killed by a crash.

Because GLM Max is quota-based rather than per-token billed, cost tracking records
quota percentage, requests per minute, concurrency, and 429 counts, plus a synthetic
currency estimate derived from published token rates for comparability.

---

## 13. Failure modes and escalation

| Failure | Detection | Response |
|---|---|---|
| Ambiguous requirement | Agent returns `blocked` with questions | Rally comment to BA; state `BLOCKED_ON_HUMAN`; no retry |
| Task fails 3 times | `attempt_count` | `BLOCKED`; transcript dumped; dashboard alert |
| Agent edits tests | Hook + CI `test-guard` | Run killed; commit rejected; job flagged |
| Infinite loop | `--max-turns` / wallclock | Reaper kills run; `attempt_count` incremented |
| Sustained HTTP 429 | Ledger error rate | Queue paused; exponential backoff; alert |
| Model provider outage | Health probe | All active jobs return to `QUEUED`; resume on recovery |
| Slot container wedged | Stale heartbeat | Reaper destroys and rebuilds slot; job requeued |
| Orchestrator crash | systemd | Restart; reconcile from `jobs`; GC orphaned worktrees |
| Server reboot | systemd units | Stack auto-starts; jobs resume from last persisted state |
| Disk full | Watermark monitor | Pause intake; prune; alert (§10) |
| Merge conflict with default branch | PR check | `REVIEW_FIX` rebase run; two failures escalate to human |
| Secret committed | Push protection | Push blocked; job flagged |
| Flaky test | Isolated re-run passes (§15.8) | Quarantined, Rally defect filed, story continues |
| Staging smoke failure after merge | `STAGING_VERIFY` | Revert PR opened automatically; `REVERT_OPEN`; human alerted |
| Story exceeds token estimate 2× | Ledger vs `token_estimate` | `BLOCKED` with `budget_exceeded`; human decides continue or abandon |
| Unvetted dependency added | Result contract + allowlist check | `BLOCKED` pending human approval |
| Dependency cycle in plan | Graph validation at GATE 1 | Plan rejected back to the planner |
| Golden pass rate drops | Nightly harness (§15.9) | Prompt or model change reverted |

Alerts are delivered by webhook (Telegram or Slack). Only three conditions justify a
night-time alert: queue paused, orchestrator down, disk full. Everything else waits.

---

## 14. Crash recovery and resume

### 14.1 Principle

The agent process is **not** resumable after a crash; the work is. Anything finer than a
task commit is disposable. A crash therefore costs the current task — typically five to
fifteen minutes — and never the story.

This holds because of one invariant, stated in §7.3.1: **no commit is ever created from
non-green code.** The orchestrator, not the agent, runs the scoped tests before
committing. Every commit on the branch is consequently a valid resume point, and it is
pushed to GitHub immediately.

### 14.2 Two distinct failure classes

**Transient network or API failure, process alive.** Handled inside the run: the client
retries with exponential backoff and jitter. A blip, a 429, or a 500 never kills a run.
If a stall exceeds the run's wallclock budget, the reaper kills the process and the
failure becomes the second class.

**Process or server death.** The heartbeat stops. Recovery is the orchestrator's
responsibility; the agent has no part in it. The runner writes `runs.heartbeat_at` every
10 seconds; a heartbeat older than 60 seconds marks the run dead.

### 14.3 Boot reconciliation

`systemd` starts the orchestrator. Before it accepts any new work, it reconciles every
job in a non-terminal state:

| Job state | Action on boot |
|---|---|
| `PLANNING` | Kill the orphaned pid if alive; mark the run `crashed`; re-run the planner from scratch. Idempotent via `external_refs`, so no duplicate Rally Stories are created. |
| `SPAWNING` | Re-run child job creation; the partial unique index (§11.1) makes already-created children a no-op. |
| `IMPLEMENTING` | Integrity-check the worktree (§14.4), reset it to `last_commit_sha`, resume at `last_completed_task + 1`. |
| `VERIFYING` | Verification is a pure function of the tree; simply re-run it. |
| `REVIEW_FIX` | Reset the worktree to HEAD and re-run with the review comments. |
| `AWAIT_DESIGN_APPROVAL`, `AWAIT_MERGE` | No action; resume gate polling. |
| `BLOCKED`, `BLOCKED_ON_HUMAN` | No action; a human owns the job. |

The `outbox` table is drained on the same pass, so Rally and GitHub side effects that
were committed but not delivered before the crash are delivered exactly once (§11.2).

### 14.4 Worktree integrity check

A worktree is usable only if all of the following hold:

```
directory exists
&& `git status --porcelain` parses successfully
&& HEAD sha == jobs.last_commit_sha
&& none of .git/MERGE_HEAD, .git/REBASE_HEAD, .git/CHERRY_PICK_HEAD exist
```

- **Pass:** `git checkout -- . && git clean -fd` restores a deterministic clean state at
  the last green commit.
- **Fail:** destroy the worktree and re-clone the branch from GitHub. The slot container
  is rebuilt from the prebuilt image, migrations are re-run, and the database is
  re-seeded. Nothing is lost because every task commit was pushed.

### 14.5 Zombie protection

An agent subprocess can outlive the orchestrator that spawned it. Two mechanisms
contain this:

- **Fencing tokens.** A reassigned slot receives a new `lease_token`. Every state write
  carries the writer's token; writes bearing a stale token are rejected.
- **Reaping.** When the orchestrator marks a run `crashed`, it sends SIGKILL to the pid
  recorded in that run row before reusing the slot.

### 14.6 Poison-task guard

`crash_count` is tracked per task and is deliberately separate from `attempt_count`. Two
crashes on the same task move the job to `BLOCKED`. Without this, a task that reliably
exhausts memory would crash-loop the server indefinitely.

### 14.7 Observability across a crash

Transcripts are appended to disk line by line as `stream-json` is produced, never
buffered until the run ends. After a crash, the transcript shows exactly what the agent
was doing at the moment of death — which is the only artifact that makes the failure
diagnosable.

### 14.8 Worst-case ledger

| Event | Work lost |
|---|---|
| Network blip | None — retried in process |
| Model API outage of hours | None — jobs return to `QUEUED` and resume |
| Agent process killed | Current task only |
| Hard server crash | Current task only |
| Disk loss or full server rebuild | Current task only — the branch lives on GitHub |
| Orchestrator database loss | Everything not represented on GitHub |

The last row is the only genuinely expensive failure, so Postgres is backed up hourly
with Restic and continuous WAL archiving. Recovery from a database loss without backups
would mean losing job state, gate history, and all metrics, even though the code itself
would survive on GitHub.

---

## 15. Quality assurance

Quality has two independent axes, and each needs its own mechanism:

- **Conformance** — does the delivered code do what the requirement and approved design
  said it would?
- **Internal quality** — is the code clean, well-structured, and consistent with the
  project's architecture?

The governing principle is that **enforcement is mechanical wherever it can be**. An
agent reviewing its own work is the weakest possible check; an agent reviewing another
agent's work is a useful supplement but never the gate. Anything that can be expressed
as a deterministic rule is expressed as one.

### 15.1 Conformance

**Identified, executable acceptance criteria.** The planner emits acceptance criteria as
`AC-1 … AC-n` in Given/When/Then form. GATE 1 asks the reviewer one question: are these
criteria correct and complete? Everything downstream is then mechanically checkable
against them.

**Traceability matrix.** Every test is tagged with the acceptance criterion it covers
(`@ac AC-3`, or `pytest.mark.ac("AC-3")`). A CI job builds `traceability.json` and fails
the build if any acceptance criterion has no passing test:

```
AC-1 → tests/checkout.spec.ts:14   ok
AC-2 → tests/checkout.spec.ts:41   ok
AC-3 → (no covering test)          FAIL
```

**Acceptance tests are written first, then locked.** The first task of every story writes
failing acceptance tests for all criteria. From that point a `PreToolUse` hook makes the
acceptance test files read-only for the remainder of the story. The implementation
cannot redefine its own target mid-flight.

**Blind conformance review.** A separate agent with a fresh context receives only the
specification and the final diff — not the plan, not the implementer's transcript. For
each criterion it must answer `MET` with `file:line` evidence, or `NOT_MET`. A verdict
of `MET` without evidence is recorded as `NOT_MET`.

**End-to-end tests** run against the slot's live application for user-facing changes
(Playwright), tagged with acceptance criteria in the same way.

**Prepared human review.** The pull request body is generated with the acceptance
criteria checklist, evidence links, and reviewer verdicts. GATE 2 becomes spot-checking
specific claims rather than reading the whole diff cold. This is the main defence against
the human reviewer becoming the throughput bottleneck.

### 15.2 Internal quality — mechanical layer

| Concern | Tool | Gate |
|---|---|---|
| Formatting and style | ruff / eslint + prettier | Zero violations |
| Types | mypy strict / tsc strict | Zero errors; no new `any` |
| Complexity | eslint `complexity`, radon | Cyclomatic ≤ 10; function ≤ 50 lines; file ≤ 400 lines |
| Duplication | jscpd | ≤ 3% and not increasing |
| Dead code | knip / vulture | No new occurrences |
| Architecture | dependency-cruiser / import-linter | Layer rules from `constitution.md` |
| Coverage | native tooling + diff-cover | Overall non-decreasing; diff coverage ≥ 85% |
| Test strength | Mutation testing (stryker / mutmut), changed files only | Mutation score ≥ 70% |
| Security | semgrep + dependency audit | Zero high-severity findings |

**Architecture fitness functions** are how structural intent is enforced, and they are
the mechanical mirror of the constitution clauses described in §8.3. Architectural rules
are encoded as executable constraints rather than prose an agent is asked to respect:

```yaml
# .dependency-cruiser.yml
forbidden:
  - name: domain-must-not-import-infra
    from: { path: "^src/domain" }
    to:   { path: "^src/(infra|db|http)" }
  - name: ui-must-not-touch-db
    from: { path: "^src/ui" }
    to:   { path: "^src/db" }
```

With these in place the agent cannot violate the layering and still produce a green
build. This converts "the agent should follow the architecture" into "the agent cannot
break the architecture".

### 15.3 Review panel

Three independent reviewer agents run in parallel against the story pull request. Each
has a fresh context and sees the diff; none sees the implementer's transcript.

1. **Conformance reviewer** — as described in §15.1.
2. **Architecture reviewer** — receives `constitution.md`, `ARCHITECTURE.md`, and
   `PATTERNS.md`. Assesses module placement, cohesion, naming, abstraction level, leaked
   concerns, and premature generalisation.
3. **Adversarial reviewer** — attempts to break the change: edge cases, error paths,
   empty and null inputs, concurrency, N+1 queries, missing validation, unhandled
   failure modes.

Findings are structured, carry a severity of `blocking`, `major`, or `minor`, and must
include a `file:line` reference and a concrete failure scenario. **A finding without a
concrete failure scenario is discarded**, which suppresses the generic advisory noise
that otherwise dominates LLM review output.

`blocking` findings trigger an automatic `REVIEW_FIX` run and return the job to
`VERIFYING`. `major` findings are posted as pull request comments for the human
reviewer. `minor` findings are recorded only.

### 15.4 Anti-gaming controls

An agent optimises for a green build and will find the cheapest path to one. Each known
shortcut has a mechanical counter:

| Shortcut | Counter |
|---|---|
| Editing existing tests | `test-guard` CI job (§9) |
| Deleting tests | Test count must not decrease |
| Skipping tests | Newly added `.skip`, `xfail`, or `it.only` fails the build |
| Weakening assertions | Mutation testing on changed files |
| Assertion-free tests | Mutation testing plus review of the test diff |
| Lowering thresholds | Config files are hook-protected and CODEOWNERS-guarded |
| `@ts-ignore`, `# noqa`, `eslint-disable`, `any` | Suppression count must not increase |
| Swallowing exceptions | semgrep rule for empty catch blocks and bare `except: pass` |
| Hardcoding a value to satisfy a test | Mutation testing, adversarial reviewer, property-based tests on acceptance criteria |
| Widening types to pass | Type-strictness ratchet |

Suppression counting deserves particular emphasis: it is the most common route by which
quality quietly degrades while every check still reports green.

### 15.5 Quality ratchet

Over months of continuous autonomous work, quality erodes through individually
defensible concessions. A baseline is stored in the repository and enforced as monotonic:

```json
// quality-baseline.json  (hook-protected; the agent cannot edit it)
{
  "coverage": 84.2,
  "duplication": 2.1,
  "suppressions": 17,
  "avg_complexity": 4.3,
  "mutation_score": 72
}
```

Metrics may improve or hold steady. Any regression fails the pull request. The baseline
is updated automatically when a metric improves, and otherwise only by a human.

### 15.6 Compounding through memory

Every human review comment at GATE 2 is distilled by a short agent run into
`PATTERNS.md` or `DECISIONS.md`, so the same correction is not needed twice.

The dashboard tracks **repeat-finding rate**. If it does not fall over successive weeks,
the project memory files are ineffective and should be revised — the metric exists to
make that visible rather than assumed.

### 15.7 Check tiering

The full gauntlet is too expensive to run per task:

- **Per task** (seconds): scoped tests, lint and typecheck on changed files.
- **Per story pull request**: full test suite, end-to-end tests, coverage, mutation
  testing, architecture rules, duplication, suppression delta, and the review panel.
- **Nightly, whole repository**: dead code, full mutation run, dependency audit, ratchet
  report.

### 15.8 Flaky test handling

A flaky test is the most disruptive operational failure in a continuously running system.
The agent sees red, exhausts its three attempts, and blocks a story that was in fact
correct. At twenty-four-hour volume this happens regularly and produces false alarms.

On any test failure the orchestrator re-runs **that test alone, twice**, before treating
the failure as real:

- **Fails consistently** — a genuine failure; the normal retry loop proceeds.
- **Passes on retry** — recorded in `flaky_tests`, added to the quarantine list, a Rally
  defect is filed against the test, and the story continues.

Quarantined tests still run and are still reported, but do not block a story. Flaky rate
is a first-class dashboard metric; a rising flaky rate degrades every other guarantee in
this section.

### 15.9 Platform regression harness

Prompt templates, model tiers, and memory files will be tuned continuously. Without a
fixed measurement, tuning is guesswork and a regression is invisible until quality has
already dropped.

A frozen set of five to ten **golden tasks** — real stories with known-good outcomes,
pinned to a specific repository commit — runs nightly. Each run records the prompt
template version, model, and pass or fail, in `golden_runs`. A prompt or model change
that lowers the golden pass rate is reverted.

The same harness gates spec-kit upgrades: bump `projects.speckit_version`, run the
harness, compare pass rates, then adopt or revert (§7.2.1).

This is the only mechanism in the design that detects the platform itself getting worse.

### 15.10 Quality metrics

- **Defect leakage** — issues found by the human at GATE 2 that every automated check
  missed. Should trend toward zero. A persistent leak is a signal to add a mechanical
  check, not to strengthen a prompt.
- **Repeat-finding rate** — effectiveness of project memory.
- **Mutation score** — whether the tests genuinely constrain behaviour.
- **Suppression delta** — quiet decay.
- **Rework rate** — proportion of pull requests requiring changes.

---

## 16. Token economics

Token spend, not CPU, is the expected operating constraint. The measures below are
ordered by expected impact.

### 16.1 Per-story frozen context

The dominant cost in the implementation phase is re-assembling the same context for
every task. The prefix — constitution, architecture excerpt, patterns, spec, plan — is
built **once at story start**, written to `jobs.context_prefix_path`, and reused
byte-identically for every task in that story.

Eight tasks then pay for one cold prefix and seven cache reads instead of eight cold
prefixes. This is the single largest saving available, plausibly 40–60% of the
implementation phase, and it is also why context ordering is stable-first (§8).

### 16.2 Model tier routing

A single model for every phase is wasteful. The `router` component assigns a tier:

| Tier | Phases |
|---|---|
| Cheap | Task splitting, commit messages, pull request body generation, memory distillation and compaction, flaky classification, defect triage |
| Strong | Implementation, conformance review, adversarial review, planning |

`runs.model_tier` records the choice so the effect is measurable.

### 16.3 Deterministic work never costs tokens

No agent is invoked for anything a tool can answer. Lint, typecheck, and tests run
before an agent is asked to fix anything, and only the failing output is passed in — not
the file. The agent has `Read` and can pull what it needs, which is cheaper than
pre-loading files it may not open.

### 16.4 Review panel tiering

Running three reviewers on every pull request is expensive and mostly redundant:

- **Conformance** — always.
- **Architecture** — only when module boundaries or public interfaces changed.
- **Adversarial** — only when the story touches authentication, payments, or data
  mutation, or when the diff exceeds a size threshold.

### 16.5 Phase-specific turn limits

`--max-turns` is set per phase rather than globally: planning 60, implementation task 40,
review 25, distillation 10. A commit-message run has no legitimate need for 120 turns.

### 16.6 Minimum task size

Every run re-pays its prefix, so ten twenty-line tasks cost considerably more than four
fifty-line tasks. The `/tasks` stage merges trivially small tasks, subject to the story
cap in §7.2 from the other direction.

### 16.7 Defect fast path

Defects with reproduction steps skip planning entirely (§7.4), saving a full planning run
per defect.

### 16.8 Retries send deltas

A task retry keeps the frozen prefix and appends only the failure output. Context is
never rebuilt.

### 16.9 Cheap checks first

Continuous integration is ordered lint → typecheck → unit → integration → end-to-end →
mutation → review agents, so the expensive reviewer agents never run against a build that
was already broken.

### 16.10 Bounded memory

See §8. Uncapped memory files raise the price of every future run indefinitely.

### 16.11 Caching: what is known and what is not

Z.AI documents a **context caching** capability across the GLM 4.5, 4.6, 4.7, and 5
series. It is **implicit**: the platform detects content identical or near-identical to
earlier requests and reuses the computation. Cached token counts are reported in
`usage.prompt_tokens_details.cached_tokens`, and cached input on the metered API is
priced at roughly a fifth of uncached input.

Two consequences for this design:

- **§16.1 gets simpler, not harder.** Because caching is implicit, there are no
  `cache_control` breakpoints to place or maintain. The frozen per-story prefix works
  provided it is byte-stable and ordered first — which makes the stable-first ordering
  rule in §8 the load-bearing element.
- **The quota question remains open.** The published cached-input discount applies to the
  metered pay-per-token API. This platform runs on a quota-based subscription tier, and
  whether cached tokens consume less quota is not documented. That is the figure that
  actually governs operating cost here.

Z.AI's Coding Plan quick-start documents neither caching behaviour nor rate and
concurrency limits for the subscription tiers. Both are therefore measured empirically in
Phase 0 (§18) before any hardware is purchased. If cached tokens turn out not to reduce
quota consumption, reduce the slot count rather than accept the higher burn rate.

References: [Z.AI context caching](https://docs.z.ai/guides/capabilities/cache),
[Z.AI Coding Plan quick start](https://docs.z.ai/devpack/quick-start).

---

## 17. Stack and hardware

### 17.1 Workload characterisation

Every technology choice below follows from the actual load, so it is stated first:

- Three slots, each task running five to fifteen minutes → **roughly 12–36 agent runs per
  hour** at peak.
- Around ten state rows and fifty event rows per task → **roughly 2,000 database writes
  per hour** in the worst case.
- Peak orchestrator request rate: **about 0.01 requests per second.**

**Raw performance is therefore not a selection criterion.** The orchestrator is
IO-bound, subprocess-bound, and idle most of the time; the binding constraints are model
quota and human review throughput. Selection criteria, in priority order, are: correctness
under crash, iteration speed, library fit, and operational simplicity for a single
maintainer.

### 17.2 Software

| Layer | Choice |
|---|---|
| Orchestrator | Python 3.12, FastAPI, pydantic, SQLAlchemy, APScheduler, mypy strict |
| State, queue, locks, notify | Postgres 16 — no separate broker (§11.4a) |
| Migrations | Alembic |
| Agent runtime | Claude Code CLI headless + spec-kit + Rally MCP (Python SDK) |
| Isolation | Rootless Podman + Compose, git worktrees |
| Egress | Forward proxy with domain allowlist; slots have no default route (§9) |
| Dashboard | FastAPI + Jinja + HTMX + SSE; canvas sprite library for the office view |
| Git operations | The `git` CLI, invoked as a subprocess |
| GitHub API | `httpx` with a typed wrapper in the orchestrator; `gh` for agent-side use |
| CI | GitHub Actions, self-hosted runner |
| Operations | systemd units, Restic with WAL archiving |

### 17.3 Rationale for the contested choices

**Python rather than Go or Rust.** No performance argument applies at 0.01 requests per
second, so the decision rests on iteration speed and library fit. The highest-churn code
is prompt assembly, specification parsing, and result-contract validation, where pydantic
and the spec-kit ecosystem (itself Python) are a direct fit. Go's genuine advantages — a
single static binary, cleaner cancellation, better daemon ergonomics — would matter if
this code were stable, and it will not be for months. Rust is the wrong tool: no
performance requirement, slowest path to a working loop. TypeScript is a legitimate
second choice, and better on one axis, in that a single language would cover
orchestrator, MCP server, and dashboard; choose it only if it is the stronger language
for the maintainer, and then use it throughout rather than mixing.

Python's weaknesses need explicit mitigation: spawn agents with `start_new_session=True`
and terminate the process **group** with `os.killpg`, since a surviving child is exactly
the zombie condition §14.5 guards against; enforce mypy strict; validate every boundary
contract with pydantic; deploy with `uv` and systemd rather than an ad hoc virtualenv.

**Postgres rather than a document store.** The idempotency design in §11 is built
directly on relational guarantees: a partial unique index for intake deduplication,
transactions spanning a state change and its outbox row, optimistic concurrency on
`state_version`, and advisory locks for the project mutex. A document store would move
those guarantees into application code, which is where crashes break them. The usual
argument for NoSQL is horizontal scale, which is irrelevant at 2,000 writes per hour. The
trade would sacrifice the property the system depends on to gain one it does not need.
SQLite would function at this volume but gives up partitioning, point-in-time recovery,
and clean multi-process writes.

**Hand-rolled durable execution rather than Temporal.** Temporal solves crash recovery,
retries, and idempotency as a product, and is the credible alternative to §14. It is
declined because its operational surface — a server, its own database, and a new
programming model — exceeds a twelve-state machine driving three slots, and because
debugging one's own state machine at three in the morning is easier than debugging a
framework's abstractions. Revisit if the platform grows beyond a handful of projects.

**Server-rendered dashboard rather than a JavaScript framework.** This is a single-user
internal tool. HTMX with server-rendered templates removes the Node build pipeline from
the server entirely and keeps the dashboard in the orchestrator's language. The office
view needs only a vendored sprite library and no build step (§12.1).

**Rootless Podman rather than Docker.** The platform executes model-generated code
continuously. Rootless containers materially improve that posture, there is no root daemon
to wedge, and Compose files carry over unchanged.

### 17.4 Hardware

**Server (recommended, comfortable for 3 slots)**
- CPU: Ryzen 9 9950X (16 c / 32 t), or a used EPYC 7443P for ECC memory and PCIe lanes
- RAM: 128 GB
- Storage: 2 TB NVMe (system, worktrees, container layers) + 4 TB for logs, artifacts,
  backups
- No GPU (the model is a hosted API)
- UPS, IPMI or smart plug for remote power cycling, SMART monitoring, auto-start on
  power restore

**Minimum viable (2 slots, tight)**
- 8 c / 16 t, 64 GB RAM, 1 TB NVMe

**Per-slot budget:** roughly 4 cores, 16 GB RAM, 50 GB disk with the container, ephemeral
database, dev server, and build all active.

---

## 18. Build order

**Phase 0 — Economic validation (one week, no hardware purchase).** The hardware
recommendation in §17 assumes the model quota can sustain three continuous agents. That
assumption is unverified, and if it is wrong the machine is over-specified. Before buying
anything:

1. Verify that prompt caching works through the z.ai Anthropic-compatible endpoint and
   that `cache_read_tokens` is reported (§16.11).
2. Measure the real GLM Max limits under sustained load: concurrency, requests per
   minute, and throttling behaviour.
3. Run one complete story end to end by hand on existing hardware. Record actual tokens
   and wall-clock time per phase.
4. Extrapolate: tokens per story × stories per day × slot count, against the quota.

The likely finding is that quota, not CPU, sets the ceiling. Purchase hardware after
step 4. Phase 1 can be built on an existing machine.

**Phase 1 — Skeleton (proves the loop).** Postgres schema, job state machine, slot
manager, one hardcoded project, `claude -p` runner, jobs created manually via CLI.
Success criterion: one story travels from `NEW` to an open PR with both gates exercised
from the CLI. Build this against a small throwaway repository, not Rally.

Phase 1 is not complete until the recovery drill passes: while a task is mid-run,
`kill -9` the agent subprocess, then the orchestrator, then reboot the host. On restart
the job must resume at `last_completed_task + 1` with no duplicated Rally items, no
duplicate pull request, and no manual intervention. Repeat the drill with the worktree
deleted, to exercise the re-clone path (§14.4).

**Phase 2 — Rally integration.** MCP server, intake poller, gate synchronisation,
comment-based question-and-answer with the BA.

**Phase 3 — Planner and spec-kit.** Feature→Story decomposition with identified
acceptance criteria; GATE 1 via the spec PR. Includes the forked command templates, the
version pin, the headless `clarify` adaptation, and the `analyze` gate (§7.2.1).
Evaluate `converge` and the bug extension here rather than assuming compatibility.

**Phase 3b — Repository onboarding workflow (§8.2).** Constitution, architecture
derivation, fitness rule generation, baseline capture, pattern extraction, human freeze,
pilot stories. Required before any second project is added, and worth running against the
first project retroactively so the process is exercised while there is only one repository
to fix.

**Phase 4 — Guardrails and CI.** Container egress allowlist, hooks, diff scanner,
`test-guard`, dependency approval gate, transcript redaction, branch protection,
self-hosted runner. Flaky-test detection and quarantine belong here too: without it, the
first unattended overnight run produces false alarms.

**Phase 5 — Quality gates (§15).** Acceptance-test-first task ordering with file
locking, traceability matrix job, architecture fitness functions, coverage and diff
coverage, suppression counting, quality ratchet baseline. These are deterministic and
should be in place before the review panel, because a mechanical check is cheaper and
more reliable than a reviewer agent asked to notice the same thing.

**Phase 6 — Review panel.** Conformance, architecture, and adversarial reviewer agents;
structured findings; automatic `REVIEW_FIX` on blocking findings; mutation testing.

**Phase 7 — Dashboard.** Ops view first: live slots, gates page, progress tree,
performance, cost, and reliability panels. The pixel office view (§12.1) comes after the
ops view works, since it is a presentation layer over the same endpoint and delivers no
capability the ops view lacks.

**Phase 8 — Post-merge verification.** Staging deployment, smoke and end-to-end suites,
`STAGING_VERIFY` state, automatic revert pull requests.

**Phase 9 — Token economics (§16).** Frozen per-story context, model tier routing, review
panel tiering, phase-specific turn limits, memory compaction. Deliberately late: these
are optimisations, and optimising a loop that does not yet work correctly wastes effort.

**Phase 10 — Scale to three projects.** Per-project memory files, dependency-aware
scheduling across stories, review-feedback distillation into memory, slot contention,
backoff, alerting, retention jobs, platform regression harness (§15.9).

Phases 0 and 1 carry the most risk and should each be validated before proceeding.

---

## 19. Principal risks

1. **Human review throughput is the real bottleneck.** Three agents can produce more
   pull requests than one person can review well. Start with a single slot and add
   slots only when the gates are demonstrably not backing up.
2. **Specification quality dominates output quality.** A vague Feature produces a vague
   Story and wasted agent hours. Enforce a Feature template in Rally with required
   fields: goal, acceptance criteria, out-of-scope, affected area.
3. **Self-hosting the tracker that schedules the work.** Mitigated by pinning the
   control-plane Rally instance and requiring manual promotion from staging (§3).
4. **Token quota, not compute, is likely the binding constraint.** The hardware
   recommendation assumes three continuous agents are affordable. Phase 0 tests that
   assumption before any purchase (§18).
5. **Prompt caching is assumed and unverified.** The cost model in §16 depends on it.
   If unavailable through the chosen endpoint, reduce slot count rather than accept the
   higher run rate (§16.11).
6. **Flaky tests degrade every guarantee in §15.** They convert real signal into noise
   and generate false blocks overnight. Detection and quarantine are Phase 4, not later.
7. **Gate latency is the throughput ceiling.** Measure it before adding slots; more
   compute behind a saturated human gate produces a longer queue, not more delivery.
8. **Toolchain drift.** spec-kit and the agent runtime both move quickly, and an
   unattended system absorbs behavioural changes silently. Pin both versions and gate
   upgrades on the golden harness (§7.2.1, §15.9).
9. **Rules that exist only as prose decay.** A constitution clause with no mechanical
   counterpart will be followed inconsistently over hundreds of runs. Audit periodically
   for clauses that have drifted into advice (§8.3).
