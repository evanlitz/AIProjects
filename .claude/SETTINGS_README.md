# Claude Code Settings Guide

## VS Code User Settings (settings.json)

Add these to your VS Code `settings.json` (Cmd/Ctrl+Shift+P → "Preferences: Open User Settings (JSON)"):

```json
{
  // Claude Code - Core Settings
  "claude-code.autoSave": true,
  "claude-code.contextWindow": "large",
  "claude-code.experimental.planMode": true,

  // Claude Code - File Watching (for better repo awareness)
  "claude-code.fileWatcher.enabled": true,
  "claude-code.fileWatcher.ignore": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.git/**",
    "**/coverage/**",
    "**/.next/**",
    "**/.cache/**"
  ],

  // Claude Code - Auto-format on Claude edits
  "claude-code.formatOnEdit": true,

  // Claude Code - Git integration
  "claude-code.git.autoStage": false,
  "claude-code.git.requireApprovalForCommits": true,

  // Editor - Make file references more visible
  "editor.links": true,
  "editor.gotoLocation.multipleReferences": "goto",
  "editor.gotoLocation.multipleDefinitions": "goto",

  // Files - Auto-save (helps Claude see changes faster)
  "files.autoSave": "onFocusChange",
  "files.autoSaveDelay": 1000,

  // Terminal - Keep Claude's bash sessions visible
  "terminal.integrated.tabs.enabled": true,
  "terminal.integrated.persistentSessionReviveProcess": "onExitAndWindowClose"
}
```

---

## Why Each Setting Matters

### `claude-code.autoSave: true`
**Impact**: Claude's edits are written to disk immediately.
**Why**: Without this, diffs and git operations work on stale file state.
**Trade-off**: None—you want Claude's changes persisted ASAP.

---

### `claude-code.contextWindow: "large"`
**Impact**: Uses 200K token context (vs. 100K default).
**Why**: Large repos need more context for navigation; reduces "I need to re-read that file" roundtrips.
**Trade-off**: Slightly slower first response (1–2s), but 30–50% fewer follow-up messages.
**Cost**: ~2x tokens per session, but ROI is massive for complex tasks.

---

### `claude-code.experimental.planMode: true`
**Impact**: Enables Plan Mode (read-only exploration before making changes).
**Why**: For big refactors or unfamiliar code, you want to review the plan before Claude touches files.
**When to use**: Trigger manually with "use plan mode" in your prompt.
**When NOT to use**: Small fixes or when you trust the change scope.

---

### `claude-code.fileWatcher.enabled: true`
**Impact**: Claude detects file changes from other tools (IDE edits, git checkouts, builds).
**Why**: If you manually edit a file or switch branches, Claude's internal state stays in sync.
**Cost**: Minimal CPU; ignore patterns keep it fast.

---

### `claude-code.formatOnEdit: true`
**Impact**: Runs Prettier/ESLint/etc. after Claude edits a file (if configured).
**Why**: Eliminates 80% of "Claude's indentation is off" complaints.
**Requires**: `.prettierrc`, `.editorconfig`, or ESLint in the repo.
**Alternative**: Use a PostToolUse hook (see Section 6) for more control.

---

### `claude-code.git.autoStage: false`
**Impact**: Claude does NOT auto-stage files after editing.
**Why**: You want explicit control over what goes into commits.
**Pair with**: `git.requireApprovalForCommits: true` to review diffs before committing.

---

### `files.autoSave: "onFocusChange"`
**Impact**: Your manual edits are saved when you switch away from the file.
**Why**: Keeps filesystem state consistent with what Claude reads.
**Alternative**: `"afterDelay"` with 1000ms if you prefer time-based saves.

---

### `terminal.integrated.persistentSessionReviveProcess`
**Impact**: Bash sessions Claude starts survive VS Code restarts.
**Why**: If Claude kicks off a long test run and you close/reopen, the session resumes.
**When NOT to use**: If you run lots of background processes (can clutter terminal tabs).

---

## settings.local.json Breakdown

### `permissions.allow`
**What**: Tools Claude can use without asking.
**Why each entry**:
- `Read/Glob/Grep/Edit`: Core file operations—blocking these kills productivity.
- `git status/diff/log/branch/show`: Read-only git commands for context gathering.
- `npm test/build/lint` (and yarn/pnpm/cargo/go equivalents): Verification commands.
- `ls/pwd/cat/head/tail/wc`: Safe filesystem inspection.

**Missing intentionally**: `Write` (new files should be reviewed), `git commit/push` (require approval).

---

### `permissions.deny`
**What**: Commands Claude is blocked from running even if you approve.
**Why**:
- `rm -rf`: Data loss risk.
- `git push --force`: Can wreck shared branches.
- `git reset --hard`: Loses uncommitted work.
- `sudo`: Privilege escalation.
- `curl | bash`, `wget | sh`: Arbitrary code execution.

**Override**: If you need these for one-off tasks, temporarily remove from deny list.

---

### `permissions.ask`
**What**: Claude must request approval before running.
**Why**:
- `Write`: New files should be reviewed (prevents accidental config overwrites).
- `git commit/push`: You want to see the commit message and diff first.
- `npm/yarn/pnpm/pip/cargo install`: Dependencies change lockfiles and can introduce vulnerabilities.

---

### `experimental.planMode`
**Impact**: Enables the read-only planning workflow.
**Usage**: Say "use plan mode" or "plan this refactor" in your prompt.
**Output**: Claude explores the code, then shows a plan with file list + steps (no edits applied).
**Workflow**:
  1. You: "Refactor auth module to use JWT"
  2. Claude: [enters plan mode, reads code]
  3. Claude: "Here's the plan: 5 files, 12 steps, here are the risks..."
  4. You: "Proceed" (Claude exits plan mode and starts editing)

---

## Testing Your Config

After applying these settings:

1. **Restart VS Code** (settings like `fileWatcher` need a reload).
2. **Test permissions**:
   ```
   Ask Claude: "Run git status and show me the output"
   Expected: Runs immediately (no prompt).

   Ask Claude: "Create a new file test.txt"
   Expected: Asks for approval (Write is in `ask` list).
   ```
3. **Test auto-format**:
   - Make sure you have `.prettierrc` or ESLint configured.
   - Ask Claude to edit a file.
   - Check that formatting is applied automatically.
4. **Test Plan Mode**:
   ```
   Prompt: "Use plan mode to explore the auth module and propose a refactor plan"
   Expected: Claude reads files but doesn't edit, then shows a plan.
   ```

---

## Troubleshooting

**Claude keeps asking for Read permission**
→ Check that `"Read"` is in `permissions.allow` (no wildcards needed).

**Auto-format not working**
→ Verify `formatOnEdit: true` in VS Code settings AND you have Prettier/ESLint installed locally.

**Plan Mode doesn't activate**
→ Say "use plan mode" explicitly; `autoEnter: false` means it's opt-in.

**Git commands blocked**
→ Make sure `git status`, `git diff*`, etc., are in the allow list with correct wildcards.

---

## Next Steps
- **Section 3**: Add MCP servers for filesystem, CI, and test automation.
- **Section 6**: Wire hooks to auto-run Prettier/ESLint after Claude edits files.
- **Section 7**: Create slash commands for common workflows (test, build, commit).
