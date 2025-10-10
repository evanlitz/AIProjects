# Claude Code Hooks

Hooks are shell scripts that run at specific points in Claude's workflow.

## Available Hooks

### `post-edit.sh`
**When**: After every Edit tool call
**Purpose**: Auto-format files (Prettier, ESLint, Black, rustfmt, etc.)
**Env vars**:
- `$CLAUDE_TOOL`: "Edit"
- `$CLAUDE_FILE_PATH`: Path to edited file

**Installation**:
```bash
chmod +x .claude/hooks/post-edit.sh
```

Then add to `.claude/settings.local.json`:
```json
{
  "hooks": {
    "PostToolUse": ".claude/hooks/post-edit.sh"
  }
}
```

---

### `pre-commit.sh`
**When**: Before git commit
**Purpose**: Block commits with secrets, lint errors, type errors
**Env vars**:
- `$CLAUDE_TOOL`: "Bash"
- `$CLAUDE_COMMAND`: The git command

**Installation**:
```bash
chmod +x .claude/hooks/pre-commit.sh
```

Option 1 - Via Claude settings:
```json
{
  "hooks": {
    "PreToolUse": ".claude/hooks/pre-commit.sh"
  }
}
```

Option 2 - Via git hooks (runs for all commits, not just Claude's):
```bash
ln -s ../../.claude/hooks/pre-commit.sh .git/hooks/pre-commit
```

---

## Hook Events

| Event | When | Use Case |
|-------|------|----------|
| `SessionStart` | Claude session begins | Load project context, show welcome message |
| `SessionEnd` | Claude session ends | Clean up temp files, show summary |
| `PreToolUse` | Before any tool runs | Block dangerous commands, log activity |
| `PostToolUse` | After any tool runs | Format files, run tests, notify user |
| `PrePrompt` | Before user prompt processed | Inject context, validate input |
| `PostResponse` | After Claude responds | Log responses, trigger follow-up actions |

---

## Creating Custom Hooks

### Example: Notify on Long Operations

```bash
#!/bin/bash
# .claude/hooks/post-tool-notify.sh

# Send desktop notification if a tool takes >10 seconds
if [ "$CLAUDE_TOOL_DURATION" -gt 10 ]; then
  notify-send "Claude Code" "Task completed: $CLAUDE_TOOL"
fi
```

### Example: Log All Commands

```bash
#!/bin/bash
# .claude/hooks/pre-bash-log.sh

# Log all bash commands to a file
if [ "$CLAUDE_TOOL" = "Bash" ]; then
  echo "[$(date)] $CLAUDE_COMMAND" >> .claude/bash-log.txt
fi
```

### Example: Auto-Test After Edits

```bash
#!/bin/bash
# .claude/hooks/post-edit-test.sh

# Run tests for edited file (if test file exists)
FILE="$CLAUDE_FILE_PATH"
TEST_FILE="${FILE%.ts}.test.ts"

if [ -f "$TEST_FILE" ]; then
  npm test "$TEST_FILE" --silent || echo "⚠️  Tests failed for $FILE"
fi
```

---

## Hook Configuration (settings.local.json)

```json
{
  "hooks": {
    "SessionStart": "scripts/session-start.sh",
    "PostToolUse": ".claude/hooks/post-edit.sh",
    "PreToolUse": ".claude/hooks/pre-commit.sh"
  }
}
```

**Multiple hooks per event**:
```json
{
  "hooks": {
    "PostToolUse": [
      ".claude/hooks/post-edit.sh",
      ".claude/hooks/auto-test.sh",
      "scripts/notify.sh"
    ]
  }
}
```

---

## Debugging Hooks

**Test manually**:
```bash
export CLAUDE_TOOL="Edit"
export CLAUDE_FILE_PATH="src/test.ts"
bash .claude/hooks/post-edit.sh
```

**Check logs**:
- VS Code: Output panel → "Claude Code Hooks"
- CLI: Add `set -x` to your hook script for verbose output

**Common issues**:
- **Hook not running**: Check file permissions (`chmod +x`)
- **Path errors**: Use absolute paths or `$PWD`
- **Command not found**: Add `export PATH=/usr/local/bin:$PATH` to hook

---

## Security Notes

⚠️ **Hooks run with your shell permissions** - they can read/write files, make network requests, etc.

**Best practices**:
1. Review hook scripts before enabling
2. Don't run hooks from untrusted repos
3. Avoid network requests in hooks (latency + privacy)
4. Use hooks for deterministic, fast operations only
5. If a hook fails, Claude will show the error but continue

**Disable hooks temporarily**:
```json
{
  "hooks": {
    "enabled": false
  }
}
```
