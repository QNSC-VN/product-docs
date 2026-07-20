# P0-AUTH-02 — Session restore and logout

## Audit scope

- Environment: `https://rally-dev.qnsc.vn/`
- Account: `hieuvbm@qnsc.vn`
- Audit date: 2026-07-19
- Checkpoint: Session restore, logout, protected-route guard and safe return URL
- Mutation level: authentication session only; no application master data changed

## Expected business behavior

- A valid authenticated session survives navigation to a protected deep link.
- Logout revokes the Mini Rally application session and returns the user to Login.
- Opening a protected route while anonymous redirects to Login.
- A safe internal return URL is preserved and restored after successful authentication.

Primary references:

- `04_Developement_tracking/Phase 0/02_Authentication/SRS.md`
- `07_Test Business/specs/PHASE0_TEST_SCENARIOS.md`

## DevInt execution and result

1. Opened `https://rally-dev.qnsc.vn/projects` from a new browser tab while an authenticated session existed.
   - Result: `/projects` loaded directly with the authenticated App Shell and project list.
2. Opened the user menu and selected **Sign out**.
   - Result: redirected to `/login`; notification displayed `Signed out`.
3. Opened `/projects` while signed out.
   - Result: redirected to `/login?returnTo=%2Fprojects`.
4. Selected **Sign in with Microsoft** again.
   - Result: Microsoft SSO completed and the application returned to `/projects`.

## Assessment

- Result: Match / Pass
- Gap count: 0
- Status: Waiting BA confirmation

The application session is revoked without attempting to terminate the broader Microsoft identity-provider session. This is correct for an application logout: subsequent Microsoft SSO can reuse the existing organizational login while Mini Rally still protects its routes until a new application session is issued.

## BA decision — confirmed 2026-07-19

BA confirmed this checkpoint as a match. No document, mockup or DevInt correction is required for the tested session restore, logout, protected-route guard and safe return URL behavior.
