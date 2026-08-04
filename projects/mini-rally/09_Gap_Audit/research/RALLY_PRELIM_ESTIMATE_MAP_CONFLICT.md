# Preliminary Estimate default values — conflict settled

Researched 2026-08-04. Both cited sources were fetched successfully (no auth wall).

## Verdict in one line

Both sources are quoted accurately; **the code comment's claim is false anyway** — KB 94797 is an
undated legacy support article about the retired *Plan Progression* page, while the current product
doc ships **XS 13 / S 20 / M 40 / L 100 / XL 250**. Our values are not Rally's defaults, but they
are the BA's own mockup table, so this is a citation defect, not a value defect.

## (a) What KB 94797 actually says, and in what role

Fetched: <https://knowledge.broadcom.com/external/article/94797/rally-how-plan-progression-capacity-is.html>
(Article ID 94797, "Rally - How Plan Progression Capacity is calculated"; Products: Rally
On-Premise, Rally SaaS; Component: `ACSAAS`; **"Updated On:" is empty — the article carries no date
and no release**).

Verbatim:

> Preliminary Estimates are valued (by default) as follows (note that this is also configureable for
> Portfolio items at the Workspace level)
> XS   = 1 pt.
> S     = 3 pts.
> M    = 5 pts.
> L     = 8 pts.
> XL   = 13 pts.

So the article **does** assert 1/3/5/8/13 and **does** label it "by default" — the code comment
quotes it correctly. Role: stated as a default, then immediately used as the input to a worked
example on a screenshot ("F42 and F2 both have a preliminary estimates of 'S', or 3 pts. each = 6
pts. total. The 'group' capacity is therefore 100%."). It is a support article about **Plan
Progression**, a page that predates today's Capacity Planning, and it is undated — i.e. the weakest
possible class of evidence for a current shipped default.

Note "pt." — the KB is the only source that attaches a unit.

## (b) Rally's shipped default, verbatim

<https://techdocs.broadcom.com/us/en/ca-enterprise-software/valueops/rally/rally-help/administration/managing-your-workspace/customizing-portfolio-item-types/customizing-fields-for-portfolio-item-types/customizing-the-portfolio-item-preliminary-estimate-field.html>

> You can add, modify, or delete preliminary estimate sizes and their associated numeric values.
> Values must be whole numbers. [...] There is no relationship between the preliminary estimate
> field and the plan estimate field. If you want these to be related, you must assign values
> accordingly. Preliminary estimates will not roll up. **The default options and their Fibonacci
> values are: XS (13) S (20) M (40) L (100) XL (250)**

Other facts from the same page:

- Editable columns are **Name, Value, Description** — one numeric per size. There is **no
  count-based second mapping anywhere in Rally**.
- The value is **unitless** in the product doc ("numeric values", "Fibonacci values"); the doc goes
  out of its way to say it is *not* tied to Plan Estimate, so calling it "points" is our reading,
  not Rally's.
- Customisation is **per workspace** — "Changes to all values in the table are saved immediately for
  the entire workspace." So the defaults are only the starting state of a new workspace; any real
  tenant's numbers can be anything.
- Values can now also be **disabled** (obsolete-value hygiene) without deleting history.

## (c) Can both be simultaneously correct?

Only under a version/era hypothesis, and it is **unproven**:

- The legacy CA Agile Central URL path for the same admin topic
  (`.../agile-development-and-management/rally-platform-ca-agile-central/rally/administration/...`)
  serves **byte-identical content**, i.e. 13/20/40/100/250, so no era split is visible in the docs
  Broadcom still publishes.
- No archived snapshot of an older version of that page could be retrieved (wayback CDX/API
  unavailable or 404 for every candidate URL), so I cannot demonstrate a former 1/3/5/8/13 default.
- What is suggestive, not conclusive: 13/20/40/100 is exactly the top of the standard Planning
  Poker deck, i.e. a deliberately **feature-scale** default, whereas 1/3/5/8/13 is a story-scale
  scale. It is plausible early Rally shipped the story-scale one and the KB fossilised it. Treat
  that as a hypothesis.

Either way it does not change the answer: **the current, version-selectable product doc wins over an
undated KB about a retired page.** This is the same precedence rule already recorded in
`rally/CLAUDE.md` for Rollup / Complete / the cutline.

## (d) Recommendation

**Do not change `DEFAULT_PRELIMINARY_ESTIMATE_MAP`. Fix the comment.** The values are not Rally's
defaults, but they are not arbitrary either — they are the BA's own table at
`04_Developement_tracking/Phase 5/01_Portfolio_Items/SRS.md:170-177`, explicitly flagged
"temporary mockup data" pending `Settings > Workspace > Project Management` (SRS:179). Since Rally
makes this a per-workspace admin setting with no cross-workspace guarantee, any seed default is
defensible; matching the approved mockups is more defensible than matching a doc nobody in this
project has designed screens against.

Rewrite `db/schema/enums.ts:471-472` to cite the BA table and record that Rally's own shipped
default is 13/20/40/100/250 (so the next reader does not "correct" it back), and note that the
`count` dimension has **no Rally counterpart at all** — Rally stores one number per size — so it is
a declared Mini-Rally extension driven by `capacity_plans.unit`, and belongs in
`docs/DIVERGENCE.md` rather than in a Broadcom citation.

**Why not re-scale:** the map feeds `preliminary-estimate-map.service.ts`, the Feature tier chain,
both Estimated Progress meters, `defaultAllocationEstimate`, and it is **hard-coded into shipped
migration `0101_capacity_allocation_fixed_value.sql:66`** as the freeze basis for existing
allocation values. Changing the constant would leave every pre-0101 allocation frozen on the old
scale while new ones use the new one — two scales inside one plan total. If a future ruling does
adopt Rally's 13/20/40/100/250, it needs its own migration that re-bases stored allocation values,
not a constant edit.
