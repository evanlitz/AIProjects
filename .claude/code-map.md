# Code Map: AIProjects

**Generated**: 2025-10-10
**Purpose**: Claude Code platform configuration repository

---

## Entry Points

- **No application entry point** (this is a config-only repo)
- **Primary files**:
  - `.claude/claude.md` - System prompt and rules
  - `.claude/settings.local.json` - Permissions configuration
  - `.vscode/tasks.json` - VS Code task definitions

---

## Repository Structure

```
AIProjects/
├── .claude/                    [Claude Code platform configuration]
│   ├── claude.md              [System prompt with rules & workflows]
│   ├── settings.local.json    [Permissions (auto-allow common tools)]
│   ├── ACTIVATION_GUIDE.md    [Setup instructions]
│   ├── CHEATSHEET.md          [Copy-paste prompts library]
│   ├── MCP_INVENTORY.md       [MCP server recommendations]
│   ├── SETTINGS_README.md     [VS Code settings guide]
│   ├── AGENT_PROMPTS.md       [How to use agents]
│   ├── agents/                [5 specialized workflow definitions]
│   │   ├── repo-cartographer.json
│   │   ├── refactor-commander.json
│   │   ├── bug-archaeologist.json
│   │   ├── doc-surgeon.json
│   │   └── evaluation-runner.json
│   ├── evals/                 [Quality testing framework]
│   │   ├── README.md
│   │   ├── tasks/             [Sample eval tasks (YAML)]
│   │   ├── oracles/           [Reference implementations]
│   │   ├── scripts/           [Test runner CLI]
│   │   └── results/           [Eval output storage]
│   └── hooks/                 [Automation scripts]
│       ├── post-edit.sh       [Auto-format after edits]
│       └── pre-commit.sh      [Block bad commits]
├── .vscode/                   [VS Code integration]
│   ├── tasks.json             [10 one-click tasks]
│   └── keybindings-suggestions.json
├── scripts/                   [Utility scripts]
│   └── claude-commit.sh       [Generate commit messages]
├── test-format.js             [Test file for format hooks]
└── package.json               [Project metadata + Prettier dependency]
```

---

## Module Breakdown

### `.claude/` — Platform Configuration
**Purpose**: All Claude Code customization lives here
**Key files**:
- `claude.md` (226 lines) - System prompt defining coding standards, workflows, forbidden actions
- `settings.local.json` - Auto-allows Read, Edit, Grep, git, npm commands
- Agents (5 JSON files) - Specialized workflow orchestrators

**Dependencies**: None (standalone config)

### `.claude/evals/` — Testing Framework
**Purpose**: Measure Claude Code quality over time
**Components**:
- Tasks (YAML): Define prompts to test
- Oracles (TS/test files): Expected outputs
- Runner script: Executes tasks, compares results, tracks regressions

**Dependencies**: Node.js, `yaml` package (not yet installed)

### `.vscode/` — Editor Integration
**Purpose**: One-click tasks for common operations
**Tasks available**:
1. Run Tests (`npm test`)
2. Run Build (`npm run build`)
3. Lint (`npm run lint`)
4. Format (Prettier)
5. Type Check (TypeScript)
6. Map Repo (invoke repo-cartographer agent)
7. Run Evals
8. Compare Evals to Baseline
9. Git Status
10. View Code Map

**Dependencies**: VS Code

### `scripts/` — Automation
**Purpose**: Helper scripts for commit workflow
**Files**:
- `claude-commit.sh` - Generate conventional commit messages

---

## Dependency Graph

```
.claude/claude.md
  └─> No dependencies (read by Claude Code on startup)

.vscode/tasks.json
  └─> References: .claude/agents/repo-cartographer.json
  └─> References: .claude/evals/scripts/run-eval.js

.claude/evals/scripts/run-eval.js
  └─> Requires: yaml package (npm install yaml)
  └─> Reads: .claude/evals/tasks/*.yaml
  └─> Reads: .claude/evals/oracles/*.ts

package.json
  └─> DevDependency: prettier (installed)
  └─> Missing: yaml (needed for evals)
```

---

## Hotspots

1. **`.claude/ACTIVATION_GUIDE.md`** (357 lines)
   - **Issue**: References non-existent `@modelcontextprotocol/server-git` package
   - **Fix needed**: Update Phase 3 to remove git server installation

2. **`.claude/MCP_INVENTORY.md`** (428 lines)
   - **Issue**: Same as above (documents non-existent git server)
   - **Fix needed**: Remove or mark as unavailable

3. **`.claude/CHEATSHEET.md`** (483 lines)
   - **Status**: Large but expected (reference material)
   - **No action needed**

4. **`.claude/evals/` framework**
   - **Issue**: Missing `yaml` dependency
   - **Fix**: Run `npm install yaml` to activate eval framework

---

## Navigation Guide

### "I want to activate Claude Code features"
→ Start: [.claude/ACTIVATION_GUIDE.md](.claude/ACTIVATION_GUIDE.md)
→ Current progress: [SETUP_PROGRESS.md](../SETUP_PROGRESS.md)

### "I want to customize system prompt behavior"
→ Edit: [.claude/claude.md](.claude/claude.md)
→ Restart VS Code to reload

### "I want to add a new agent"
→ Copy: [.claude/agents/repo-cartographer.json](.claude/agents/repo-cartographer.json)
→ Customize `systemPrompt`, `tools`, `model`
→ Save in `.claude/agents/[name].json`

### "I want to run eval tests"
1. Install dependency: `npm install yaml`
2. Run: `Ctrl+Shift+P` → "Tasks: Run Task" → "Claude: Run Evals"
3. View results: `.claude/evals/results/`

### "I want to add a VS Code task"
→ Edit: [.vscode/tasks.json](.vscode/tasks.json)
→ Add new entry in `tasks` array
→ Reload VS Code

---

## Repository Type

**Classification**: Configuration/Platform Repo
**Pattern**: Infrastructure-as-code for AI assistant
**Not applicable**: Traditional app structure (no src/, lib/, components/)

---

## Next Steps (Setup Completion)

**Completed** (Phases 1–2):
- ✅ System prompt loaded
- ✅ Permissions configured
- ✅ VS Code tasks working

**Remaining** (From ACTIVATION_GUIDE.md):
- [ ] **Phase 3**: Install MCP servers (optional, skipped for now)
- [ ] **Phase 4**: Test remaining agents (refactor-commander, bug-archaeologist)
- [ ] **Phase 5**: Install `yaml` package and run baseline eval
- [ ] **Phase 6**: Bookmark CHEATSHEET.md, set up weekly eval runs

**Fixes needed**:
- Update ACTIVATION_GUIDE.md (remove non-existent git server)
- Update MCP_INVENTORY.md (same issue)
- Install `yaml` package for eval framework

---

**Map last updated**: 2025-10-10
