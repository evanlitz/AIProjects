# Claude Code Daily Driver Cheatsheet

Copy-paste prompts for common workflows.

---

## 📖 Reading Unfamiliar Repos

### Quick Overview
```
Give me a 2-level code map: entry points, top modules, and tech stack.
Highlight: where to start for common tasks.
```

### Deep Dive (Specific Module)
```
Explain the [module name] module:
- What it does (1 sentence)
- Key files and their roles
- Dependencies (what it imports, what imports it)
- How to test it
```

### Find Where Something Happens
```
Find all code that handles [feature/behavior, e.g., "user authentication"].
Show: files involved, entry points, and flow.
```

---

## 🛠️ Implementing Features Safely

### Feature Planning (Use Plan Mode)
```
Use plan mode.

Feature: [description]

Requirements:
- [req 1]
- [req 2]

Show me:
1. Files to touch (with reasoning)
2. Step-by-step plan
3. Risks and mitigations
4. Testing strategy
```

### Feature Implementation (After Approval)
```
Implement [feature] based on the plan.

For each step:
1. Show diff first
2. Wait for approval (if high-risk)
3. Apply changes
4. Run tests
5. Checkpoint

Stop if tests fail.
```

### Add Tests First (TDD)
```
Write tests for [feature] before implementing.

Test cases:
- Happy path: [describe]
- Edge cases: [list them]
- Error cases: [list them]

Then implement the feature to make tests pass.
```

---

## 🔄 Migrating APIs

### Migration Plan
```
Migrate from [old API] to [new API] in [scope, e.g., "all files in src/api/"].

Steps:
1. Find all usage sites (grep)
2. Show migration plan (one site at a time? or batched?)
3. For each batch: show diff, apply, run tests
4. Update docs (JSDoc, README)
5. Add deprecation warning to old API (if applicable)

Checkpoint after each batch.
```

### Deprecation Warning
```
Add deprecation warnings to [old function/API].

Warn users to migrate to [new API].
Include: version when it will be removed, migration guide link.
```

---

## 🐛 Debugging & Fixing Bugs

### Bug Triage
```
Bug report:
- Error: [paste error message]
- Repro: [steps]
- Context: [when it started, environment]

Do:
1. Reproduce locally (write a test that fails)
2. Hypothesis tree (most → least likely causes)
3. Investigate in priority order
4. Root cause (explain WHY it broke, not just WHAT)
```

### Fix with Proof
```
Fix [bug] and prove it works.

Steps:
1. Write failing test (confirm it fails now)
2. Apply minimal fix
3. Run test (confirm it passes)
4. Run full test suite (no regressions)
5. Add edge-case tests (prevent similar bugs)
```

### Find When It Broke (Git Bisect)
```
This bug wasn't present in [last known good version, e.g., "v1.2.0" or "last week"].

Use git log to find suspicious commits.
For each candidate: show the diff and explain if it could cause [symptom].
```

---

## 🧹 Refactoring

### Safe Refactor Plan
```
Refactor [what] to [goal, e.g., "use async/await instead of callbacks"].

Requirements:
- Backwards compatible: [yes/no]
- All tests must pass
- No new dependencies

Output:
1. Blast radius (files affected, # of changes)
2. Step-by-step plan (each step touches <5 files)
3. Rollback strategy (how to undo if it breaks)
4. Testing plan (which tests to run after each step)
```

### Execute Refactor (Use Agent)
```
@refactor-commander

[Paste the plan from above, or describe the refactor]

Execute step-by-step. Show diffs for approval before applying.
```

---

## ✅ Writing Tests from Specs

### Generate Test Suite
```
Write tests for [function/module].

Spec:
- Input: [describe]
- Output: [describe]
- Edge cases: [list]
- Error cases: [list]

Use [test framework, e.g., Jest/Mocha/pytest].
Aim for 90%+ coverage.
```

### Add Missing Tests
```
Find functions in [file/module] that have no tests.

For each:
1. Write a minimal test suite (happy path + 2–3 edge cases)
2. Run tests to confirm they pass
```

---

## 📝 Generating Precise Diffs

### Show Diff Before Applying
```
Show me the diff for [change] (don't apply yet).

Include 3 lines of context around each change.
If it touches >3 files, group by file.
```

### Apply Specific Diff
```
Apply this diff:

[paste diff in unified format]

Run tests after applying. If they fail, revert and explain why.
```

---

## 💬 Generating Commit Messages

### Commit Current Changes
```
Generate a conventional commit message for staged changes.

Format:
type(scope): short summary (≤50 chars)

- Why this change (not what—code shows what)
- User impact or architectural reasoning
- Issue references if available

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

### Commit with Context
```
Review these changes and write a commit message:

[paste git diff or describe changes]

Context:
- This fixes [issue]
- Related to [feature/project]
- Breaking change: [yes/no]
```

---

## 🚀 Workflow Chaining

### Feature → Test → Doc → Commit
```
1. Implement [feature] (show plan first)
2. Write tests (ensure they pass)
3. Update docs (README, JSDoc, CHANGELOG)
4. Generate commit message
5. Review everything, then commit
```

### Bug → Fix → Test → Commit
```
1. @bug-archaeologist: analyze [bug]
2. Apply the proposed fix
3. Run tests (confirm fix works)
4. Update CHANGELOG
5. Generate commit message
```

### Refactor → Test → Doc → PR
```
1. @refactor-commander: refactor [module]
2. Run full test suite (confirm no regressions)
3. @doc-surgeon: sync docs with new code
4. Create PR with summary
```

---

## 🧠 Using Sequential Thinking MCP

### Architecture Decision
```
@sequential-thinking

Compare approaches for [problem]:

Option A: [describe]
Option B: [describe]

Constraints:
- [performance, cost, team skill, time]

Output: Decision matrix + recommendation.
```

### Complex Debugging
```
@sequential-thinking

Analyze this bug:
- Error: [paste]
- Repro: [steps]
- Context: [environment, recent changes]

Output:
1. Hypothesis tree (most → least likely)
2. For each: how to test it
3. Investigation order
```

### Requirement Clarification
```
@sequential-thinking

The client wants [vague requirement, e.g., "fast search"].

Context:
- Current setup: [tech stack]
- Scale: [users, data size]
- Budget: [time, cost]

Output: Clarify what "fast" means here, propose 2–3 concrete implementations.
```

---

## 🗺️ Repository Maintenance

### Generate/Update Code Map
```
@repo-cartographer

Map this codebase (or update existing map).

Focus: [all | specific area, e.g., "API layer"]

Output: .claude/code-map.md
```

### Identify Hotspots
```
Find files that are:
- Large (>500 lines)
- High churn (changed frequently in last month)
- Circular dependencies

Recommend: candidates for splitting, refactoring, or adding tests.
```

---

## 📊 Running Evals

### Baseline Eval
```
@evaluation-runner

Run suite: all

Save to: results/baseline.json
```

### Compare to Baseline
```
@evaluation-runner

Run suite: all
Compare to: results/baseline.json

Show: regressions, improvements, metric deltas.
```

---

## 🔗 Slash Command Ideas

Create these in `.claude/commands/` for one-word shortcuts:

### `/map`
```markdown
<!-- .claude/commands/map.md -->
@repo-cartographer map this codebase
```

### `/test`
```markdown
<!-- .claude/commands/test.md -->
Run the full test suite and report results.
If any tests fail, show the failures and propose fixes.
```

### `/fix [error]`
```markdown
<!-- .claude/commands/fix.md -->
@bug-archaeologist

Bug: {{args}}

Find root cause, propose fix, write test.
```

### `/refactor [description]`
```markdown
<!-- .claude/commands/refactor.md -->
@refactor-commander

Refactor: {{args}}

Show plan first, then execute step-by-step.
```

### `/commit`
```markdown
<!-- .claude/commands/commit.md -->
Generate a conventional commit message for staged changes.
Show the message, then ask if I want to commit.
```

### `/pr`
```markdown
<!-- .claude/commands/pr.md -->
Create a pull request:
1. Review branch diff vs main
2. Generate PR title + description
3. List testing steps
4. Push and create PR
```

---

## 🎯 Tips for Better Prompts

1. **Be specific**: "Refactor auth" → "Migrate auth from sessions to JWTs"
2. **Provide constraints**: Deadlines, backwards-compat, test coverage
3. **Ask for plans first**: "Show me a plan" before "Do it"
4. **Break into steps**: For complex tasks, number the steps
5. **Reference files**: Use `@filename` or paste paths
6. **Set expectations**: "Show diff for approval" vs "Just do it"
7. **Use checklists**: For deliverables (code, tests, docs)

---

## 🆘 When Things Go Wrong

### Claude Made a Mistake
```
Undo the last change to [file].
Restore it to the version before your last edit.
```

### Tests Are Failing
```
The tests are failing after your changes.

Error: [paste]

Do:
1. Show what you changed (diff)
2. Explain why tests might be failing
3. Propose a fix (show diff first)
```

### Too Many Changes at Once
```
Pause. Let's break this into smaller steps.

What we've done so far:
- [list changes]

What's left:
- [list remaining]

Let's checkpoint: commit current changes, then continue.
```

---

**Version**: 1.0
**Last updated**: 2025-10-09

**Pro tip**: Bookmark this file and keep it open in a tab. Copy-paste liberally.
