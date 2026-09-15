# Local quality gate — notes_afo

GitHub Actions is disabled for this repository (zero CI cost policy). Run the former CI steps locally.

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm format:check
pnpm typecheck
# plus the test/build steps from the former workflow
```

## Evidence required
For each gate, record: command, exit code, test counts, timestamp, commit SHA.

## Policy
GitHub Actions is DISABLED (zero CI cost). Do not add .github/workflows. Run gates locally.