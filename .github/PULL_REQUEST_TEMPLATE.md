## Summary

<!-- One or two sentences: what does this PR change? -->

## Motivation / context

<!-- Why is this change needed? Link issues, ADRs, or prior discussion. -->

## Areas touched

<!-- Check all that apply -->

- [ ] .claude (plugins / core / skills / MCP server)
- [ ] mirabile web (browser UI / config / model / routes / extensions)
- [ ] client (api / database / components / pages / utils)
- [ ] CI / GitHub Actions
- [ ] Documentation / developer experience

## Scope & constraints

**In scope**

- <!-- bullets -->

**Explicitly out of scope / not done here**

- <!-- bullets — prevents reviewers assuming missing work is an oversight -->

## Implementation notes

<!-- Optional: design choices, tradeoffs, follow-ups -->

## Testing & verification

<!-- What you ran; paste commands. Omit sections that do not apply. -->

- [ ] **Client dev server** — `cd client && npm start` — app loads on http://localhost:3000
- [ ] **Client tests** — `cd client && npm test -- --watchAll=false` — all tests pass
- [ ] **Client build** — `cd client && npm run build` — production build succeeds
- [ ] **Server start** — `cd server && node index.js` — API starts on port 5000
- [ ] **API smoke test** — `curl http://localhost:5000/api/message` — expected response

## Risk & rollout

<!-- Breaking changes, migrations, index refresh (`npx gitnexus analyze`), release notes -->

## Checklist

- [ ] PR body meets repo minimum length (workflow may label short descriptions)
- [ ] If `AGENTS.md` / overlays changed: headers, scope block, and changelog updated per project conventions
- [ ] No secrets, tokens, or machine-specific paths committed