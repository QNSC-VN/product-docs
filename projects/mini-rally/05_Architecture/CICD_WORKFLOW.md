# Rally — CI/CD & Release Workflow

> **Status:** Phase 1 implemented (`rally-api` + `rally-infra` repos).
> **Strategy:** Scaled trunk-based development — one permanent branch (`main`), short-lived feature branches, environments controlled by tags not branches.
> **Companion docs:** infra provisioning → `ARCHITECTURE_CURRENT.md`; scale triggers → `ARCHITECTURE_FUTURE_SCALE.md`.

---

## 1. Branching Model — Scaled Trunk-Based Development

```
main  (trunk — always deployable, always green)
  ↑
  ├── feature/RALLY-123-short-description   (≤ 2 days)
  ├── fix/RALLY-456-bug-description
  └── chore/bump-deps
```

### Rules
| Rule | Rationale |
|------|-----------|
| `main` is always green and deployable | Every commit can go to production |
| Feature branches live ≤ 2 days | Long-lived branches create merge conflicts and delay integration |
| No `develop`, `staging`, or `release` branches | Environments are ECS clusters, not Git branches |
| Squash-merge only to `main` | One clean commit per feature; readable history |
| Feature flags control progressive rollout | Not branches |
| Hotfix = `fix/*` → `main` → tag immediately | No separate hotfix branch needed |

### PR commit message convention (Conventional Commits)
```
feat(workitems): add bulk status update endpoint
fix(auth): prevent token reuse after revoke
chore(deps): bump drizzle-orm to 0.46.0
refactor(tenancy): extract RLS helper to shared lib
ci(deploy): rename staging → develop environment
```

---

## 2. Current Setup — 2 Environments (Phase 1)

```
main (trunk)
    │
    ├──► [CI] lint + typecheck + test + build    ← every push / PR
    │
    ├──► auto-deploy → DEVELOP env              ← every merge to main
    │         (ECS Fargate ap-southeast-1)
    │
    └──► git tag v1.2.3
              │
              └──► build images → approval gate → PROD env
```

### Environment comparison

| | develop | production |
|-|---------|------------|
| **Trigger** | push to `main` | tag `v1.2.3` + approval |
| **ECS cluster** | `rally-develop` | `rally-prod` |
| **RDS** | `db.t4g.medium`, single-AZ | `db.t4g.large`, Multi-AZ |
| **ECS tasks** | 1 × api, 1 × worker | 2 × api, 2 × worker |
| **NAT gateways** | 1 (cost optimised) | 3 (one per AZ, HA) |
| **Deletion protection** | off | on |
| **WAF rate limit** | 1 000 req/5 min | 3 000 req/5 min |
| **Backup retention** | 3 days | 30 days |

---

## 3. Workflows — `rally-api`

### 3.1 CI (`ci.yml`) — every push and PR

```
trigger: push to main, pull_request to main

jobs:
  quality     → ESLint + TypeScript typecheck
  test        → unit + e2e  (postgres:17 + redis:7 service containers)
  build       → Docker build (api / worker / migrator targets)
  openapi     → generate spec + oasdiff breaking-change check on PRs
```

All four jobs must pass before a PR can merge (branch protection).

### 3.2 Deploy (`deploy.yml`) — merge or tag

```
trigger:
  push branches: [main]              → DEVELOP
  push tags: v[0-9]+.[0-9]+.[0-9]+  → PRODUCTION

jobs:
  context      → resolve environment name + image tag from trigger
  build-push   → build 3 Docker images, push to ECR
                 (assumes rally-github-ecr-push OIDC role)
  deploy       → run migration task → update API service → update worker service
                 (assumes rally-github-deploy-{env} OIDC role)
```

#### Deploy job — step-by-step
```
1. Assume OIDC role for the target environment
2. Register new migrator task definition revision (updated image tag)
3. Run migration ECS task — wait for exit 0 (blocks deploy on failure)
4. Deploy API:   register new task def → aws ecs update-service → wait stable
5. Deploy Worker: same pattern
6. Write deployment summary to GitHub step summary
```

> **Safety:** migrations always run before the new app code. If migrations fail, services are not updated. Deployment circuit breaker + rollback is enabled on both ECS services.

### 3.3 Authentication — GitHub OIDC (no stored AWS keys)

```
GitHub Actions JWT  →  STS AssumeRoleWithWebIdentity
                            │
                 ┌──────────┴──────────┐
         ecr-push role           deploy-{env} role
         (any branch)            (main branch only / tag)
```

No `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` stored anywhere.

---

## 4. Workflows — `rally-infra`

### 4.1 Plan (`plan.yml`) — every PR to `rally-infra`

```
trigger: pull_request to main (paths: live/**, modules/**)

jobs:
  detect-changes  → diff against base branch, find changed live/ dirs
                    if modules/ changed → plan all workspaces
  plan (matrix)   → tofu init + validate + plan per workspace
                    post plan output as PR comment
```

### 4.2 Apply (`apply.yml`) — push to `rally-infra` main

```
trigger: push to main (paths: live/**, modules/**)

jobs:
  apply-shared   → live/_shared  (ECR repos + OIDC roles)
  apply-develop  → live/develop  (auto, no approval)
  apply-prod     → live/prod     (requires GitHub Environment approval)
```

**Critical constraint:** app `deploy.yml` never runs `tofu apply`. Code deploys only call `aws ecs update-service`. Infrastructure changes go through `rally-infra` exclusively.

### 4.3 Infra authentication — OIDC roles

| Role | Permissions | Restriction |
|------|-------------|-------------|
| `rally-github-infra-plan` | `ReadOnlyAccess` | any branch in `rally-infra` |
| `rally-github-infra-apply` | `AdministratorAccess` | `main` branch only |
| `rally-github-ecr-push` | ECR push/pull | any branch in `rally-api` |
| `rally-github-deploy-develop` | ECS deploy | `main` branch |
| `rally-github-deploy-production` | ECS deploy | `main` branch + tag `v*` |

---

## 5. Release Process (Current — 2 envs)

```bash
# 1. Normal feature work
git checkout -b feature/RALLY-123
git push && open PR
# CI passes + CODEOWNERS approval → squash merge

# 2. Merged to main → auto-deploys to DEVELOP immediately

# 3. Verify on develop (manual smoke test or automated)

# 4. Cut a release
git tag v1.2.0
git push --tags
# → CI runs on tag (build-push job)
# → GitHub "production" environment approval requested
# → Reviewer approves → migrations run → prod updated
```

### Tag convention
| Pattern | Deploys to | Gate |
|---------|-----------|------|
| `v1.2.3` | Production | Manual approval |
| *(no tag)* | Develop | Automatic |

---

## 6. CODEOWNERS (rally-api)

```
*                      @org/backend-team          # default — all files
apps/api/src/auth/     @org/backend-leads         # auth changes need lead review
libs/auth/             @org/backend-leads
db/migrations/         @org/backend-leads         # schema changes always reviewed by lead
.github/workflows/     @org/backend-leads         # CI/CD changes reviewed by lead
libs/platform/         @org/backend-leads         # shared config reviewed by lead
```

---

## 7. Branch Protection — `main` (required GitHub settings)

```
✅ Require pull request before merging
✅ Require at least 1 approval
✅ Dismiss stale reviews when new commits are pushed
✅ Require review from code owners (CODEOWNERS)
✅ Require status checks to pass:
     - ci / quality
     - ci / test
     - ci / build
✅ Require branches to be up to date before merging
✅ Do not allow bypassing the above settings
✅ Restrict force pushes
✅ Restrict deletions
```

---

## 8. Future State — 3 Environments (Phase 2+)

When the team needs a dedicated QA sign-off stage before production:

```
main (trunk)
    │
    ├──► auto-deploy → DEVELOP         ← every merge
    │
    ├──► git tag v1.2.0-rc.1
    │         └──► auto-deploy → UAT   ← QA tests here
    │                   │
    │              (bug found)
    │              fix/* → main → tag v1.2.0-rc.2 → UAT again
    │
    └──► git tag v1.2.0  (no -rc suffix)
              └──► approval → PROD
```

### What changes for 3 envs

| Component | Change |
|-----------|--------|
| `rally-infra` | Add `live/uat/` (same template as `live/develop/`, mid-sized instances) |
| `modules/iam-oidc` | Add `rally-github-deploy-uat` OIDC role |
| `rally-infra/apply.yml` | `_shared → develop → uat → prod` chain |
| `rally-api/deploy.yml` | Add `v*-rc.*` tag pattern → UAT environment |
| GitHub Environments | Add `uat` (no approval needed); configure `production` with reviewers |

### Tag convention (3-env)
| Pattern | Deploys to | Gate |
|---------|-----------|------|
| *(no tag, merge to main)* | Develop | Automatic |
| `v1.2.0-rc.1` | UAT | Automatic |
| `v1.2.0` | Production | Manual approval |

No new branching rules needed. Trunk stays the same. Tags drive promotion.

---

## 9. Decisions Log

| Decision | Rationale | Alternatives rejected |
|----------|-----------|----------------------|
| Trunk-based over Gitflow | No merge conflicts, continuous integration, fast hotfix path | Gitflow — merge conflict debt, slow cycle |
| No `develop` branch (it's an env) | Environments = ECS clusters, not Git branches | `develop` branch — creates long-lived divergence |
| Tag-based prod release over GitHub Release event | `push.tags` trigger is simpler, works without creating a GitHub Release object | `release.published` event — extra manual step |
| OIDC over stored IAM keys | No secret rotation, no credential leak risk, per-branch scoping | `AWS_ACCESS_KEY_ID` — rotates every 90 days, leakable |
| Squash merge only | Linear history, clean `git log`, easy bisect | Merge commits — noisy history; rebase — risky for shared branches |
| Migrations run before service update | Prevents new code from running against old schema | Blue/green with schema compat — complex, deferred to Phase 2 |
