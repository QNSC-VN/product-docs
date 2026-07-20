# P0-AUTH-01 — Login and authentication method

## Audit scope

- Environment: `https://rally-dev.qnsc.vn/`
- Account: `hieuvbm@qnsc.vn`
- Audit date: 2026-07-19
- Checkpoint: Credential/SSO login and validation
- Mutation level: read-only authentication flow; no application master data changed

## Confirmed baseline

Current Phase 0 SRS and mockup define an application-managed email/password flow:

- Email and password fields.
- Show/hide password.
- Remember-me option.
- Generic invalid-credential feedback.
- Forgot/reset/change-password are part of the documented authentication direction, although some mockup screens are incomplete.
- `custom SSO/OAuth enterprise` is explicitly listed as out of scope in the Phase 0 Authentication SRS.

Primary references:

- `04_Developement_tracking/Phase 0/02_Authentication/SRS.md`
- `04_Developement_tracking/Phase 0/PHASE0_MOCKUP_CHECKLIST.md`
- `03_Mockup Design/src/app/pages/LoginPage.tsx`
- `07_Test Business/specs/PHASE0_TEST_SCENARIOS.md`

## DevInt observed behavior

1. Opening `/login` displays the Mini Rally public login layout.
2. The only authentication action is **Sign in with Microsoft**.
3. The action redirects to Microsoft Entra ID at `login.microsoftonline.com`.
4. Entering the organizational account and completing authentication redirects to `/`.
5. The authenticated Home page and global App Shell render for `Hieu Vu Minh Bui`.

Positive organizational SSO login therefore passes. DevInt does not expose the local email/password fields or the associated application-managed password functions described in the current baseline.

## Gap assessment

- Gap ID: `GAP-P0-AUTH-001`
- Classification: Business Rule
- Severity: P1 — major alignment decision, but the positive login path is operational
- Status: Waiting BA

This is primarily a baseline mismatch, not evidence that the DevInt login is broken.

## Recommended decision

Adopt **Microsoft SSO as the authoritative rule for the internal product** and reconcile the BA baseline:

1. Change Phase 0 Authentication SRS from local email/password to Microsoft SSO-first.
2. Update the login mockup to the single Microsoft sign-in action and organization-account copy.
3. Replace local password test cases with SSO redirect, callback, session, logout, access-denied and inactive-account scenarios.
4. Move local password, forgot-password, reset-password and change-password functionality to Future Backlog unless a non-Microsoft user population is confirmed.

Alternative only if the product still requires local accounts: retain the existing documents and request DevInt to add an explicit local sign-in path alongside Microsoft SSO.

## Test boundary

Wrong-password, suspended-account and Microsoft tenant-policy negative cases were not executed with this account to avoid lockout or organizational security impact. They should be tested with a dedicated controlled account after the authentication model is confirmed.

## BA decision — confirmed 2026-07-19

Microsoft SSO is the authoritative authentication model. After the complete DevInt Phase 0–3 audit, reconcile the Phase 0 SRS, login mockup and testing documents to SSO-first. Move local password, forgot-password, reset-password and change-password to Future Backlog unless the business later expands the supported user population.
