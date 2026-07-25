---
name: push
description: >-
  Updates README with recent changes, then commits and pushes to GitHub.
  Use when the user says push, commit and push, or asks to publish local
  changes to the remote repository.
---

# Push

When the user says **push** (or clearly asks to commit and push), run this workflow end-to-end.

## Workflow

### 1. Inspect

In the project root, run in parallel:

- `git status`
- `git diff` (unstaged) and `git diff --staged`
- `git log -5 --oneline` (match commit message style)

If there are no changes to commit (and no staged files), stop. Do not create an empty commit. Tell the user there is nothing to push.

### 2. Update README

Edit `README.md`:

- Keep existing setup and usage docs
- Add or refresh a **Recent changes** section near the top (after the intro) with short bullets summarizing what this commit will include
- Be specific to the actual diff; do not invent features

### 3. Stage

Stage relevant project files, including the updated `README.md`.

Never stage:

- `.env`, `.env.local`, or other secret files
- credentials, tokens, or `mcp.json` with secrets
- `node_modules/`, build output, or other ignored artifacts

### 4. Commit

Create one concise commit message focused on **why**, matching recent repo style.

On Windows PowerShell:

```powershell
git commit -m @"
Commit message here.

"@
```

Follow the user's git safety rules:

- Do not update git config
- Do not use `--no-verify` or skip hooks
- Do not amend unless the user's amend conditions are all met
- Do not force-push to `main`/`master`

If the commit fails due to a hook, fix the issue and create a **new** commit (do not amend).

### 5. Push

Ensure `origin` exists and points at:

`https://github.com/MOAboAli/Compu-Aboal.git`

Then:

```powershell
git push -u origin HEAD
```

If git auth fails, fall back to GitHub MCP `push_files` for changed files, or report the failure clearly. Do not print PATs or rewrite MCP config as part of this skill.

### 6. Confirm

Reply with:

- Short summary of what was committed
- Commit hash (short) if available
- Repo URL: https://github.com/MOAboAli/Compu-Aboal

## Notes

- Include the README update in the same commit as the code changes
- Prefer one push of everything related to the current work; do not split unless the user asks
