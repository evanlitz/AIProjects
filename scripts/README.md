# Utility Scripts

Helper scripts for Claude Code workflows.

## `claude-commit.sh`

Generates commit messages using Claude.

**Usage**:
```bash
# Stage your changes
git add .

# Run the script
./scripts/claude-commit.sh

# Claude will:
# 1. Review staged changes
# 2. Generate a conventional commit message
# 3. Show it for approval
# 4. Commit if you approve
```

**What it does**:
- Reads `git diff --cached`
- Asks Claude to write a commit message following conventional commits format
- Includes the standard Claude Code footer
- Lets you review before committing

---

## Future Scripts (Placeholders)

### `claude-pr.sh`
Generate PR descriptions from branch diffs.

### `claude-review.sh`
Review code changes and suggest improvements.

### `claude-migrate.sh`
Plan and execute code migrations (e.g., API updates).

---

## Adding Scripts

1. Create a new `.sh` or `.js` file in this directory
2. Make it executable: `chmod +x scripts/your-script.sh`
3. Document it in this README
4. Optionally add a VS Code task in `.vscode/tasks.json`
5. Optionally add a keybinding in `.vscode/keybindings-suggestions.json`

**Template**:
```bash
#!/bin/bash
# Description of what this script does

set -e  # Exit on error

# Your code here
echo "Hello from Claude Code script"
```
