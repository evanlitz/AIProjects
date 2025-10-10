# Agent Prompt Templates

## How to Use Agents

### Via Task Tool (Programmatic)
```
@repo-cartographer map this codebase
```

### Via Explicit Delegation
```
Delegate to the refactor-commander agent:
Refactor all `getUserById` calls to use the new `fetchUser` API
```

### Via Slash Commands (after you create them in Section 7)
```
/map-repo
/refactor [description]
/fix-bug [error]
```

---

## 1. Repo Cartographer

### Command Prompt Template
```markdown
@repo-cartographer

Build (or update) a code map for this repository.

**Focus areas** (optional):
- [e.g., "focus on the API layer" or "ignore test files"]

**Output**: `.claude/code-map.md` with:
- Entry points (how to run the app, tests, CLI)
- Module structure (2–3 levels deep)
- Dependency graph (which modules import which)
- Hotspots (large/high-churn files, circular deps)
- Navigation guide (where to start for common tasks)
```

### Self-Execution Steps (Agent Runs Autonomously)
1. **Discover entry points**: Find `package.json` scripts, `main.ts`, `app.py`, Dockerfiles
2. **Map modules**: List top-level directories, sample 1–2 files per dir to infer purpose
3. **Build dependency graph**: Grep for imports, identify core vs leaf modules
4. **Find hotspots**: Run `git log --stat` for churn, `wc -l` for size, grep for circular imports
5. **Write map**: Create/update `.claude/code-map.md`

### Artifacts Emitted
- **`.claude/code-map.md`**: Navigable map of the codebase
- (Optional) **`.claude/dependency-graph.mermaid`**: Visual diagram

### When to Use
- ✅ First time in a new repo
- ✅ After major refactor (update module boundaries)
- ✅ Weekly (refresh hotspots)
- ❌ Small projects (<50 files) - overkill

---

## 2. Refactor Commander

### Command Prompt Template
```markdown
@refactor-commander

Refactor: [description of what to change]

**Goal**: [1 sentence - why we're doing this]

**Constraints**:
- Backwards compatible: [yes/no]
- Must ship by: [deadline, if any]
- Test coverage: [high/medium/low]

**Output**:
1. Plan (steps, blast radius, rollback strategy)
2. Execute step-by-step (show diffs, run tests after each step)
3. Final summary (files changed, tests passed, next steps)
```

### Self-Execution Steps (Per Step in the Plan)
1. **Show diff** (don't apply yet)
2. **Get approval** (if high-risk) or auto-proceed (if low-risk)
3. **Apply edits** (Edit tool)
4. **Run tests** (affected tests only)
5. **Checkpoint** (optionally create WIP commit)
6. Repeat for next step

### Artifacts Emitted
- **Edited files** (via Edit tool)
- **WIP commits** (optional, for rollback points)
- **Final summary** (Markdown report of what changed)

### When to Use
- ✅ Renaming across >3 files
- ✅ API migrations
- ✅ Changing function signatures
- ❌ Single-file refactors
- ❌ Formatting-only changes

---

## 3. Bug Archaeologist

### Command Prompt Template
```markdown
@bug-archaeologist

**Bug report**:
- **Error**: [paste error message or stack trace]
- **Repro steps**:
  1. [step one]
  2. [step two]
  3. Expected [X], got [Y]
- **When did this start**: [regression / long-standing / unknown]

**Output**:
1. Repro confirmation (can you reproduce it?)
2. Hypothesis tree (most → least likely causes)
3. Root cause analysis (which line broke, why)
4. Fix with proof (failing test → fix → passing test)
5. Prevention (additional tests, type fixes)
```

### Self-Execution Steps
1. **Repro**: Write a minimal test that fails
2. **Bisect**: Check git history for suspicious commits
3. **Investigate**: Trace execution path, read broken code
4. **Root cause**: Explain why it's broken (not just what)
5. **Fix**: Apply minimal change
6. **Proof**: Run test (confirm it now passes)
7. **Prevent**: Add edge-case tests

### Artifacts Emitted
- **Failing test** (committed before fix)
- **Fix** (code changes via Edit)
- **Passing test** (confirms fix works)
- **Root cause report** (Markdown summary)

### When to Use
- ✅ Intermittent bugs
- ✅ Regressions
- ✅ Production incidents
- ❌ Typos (just fix them)
- ❌ Feature requests

---

## 4. Doc Surgeon

### Command Prompt Template
```markdown
@doc-surgeon

**Task**: [sync docs after refactor / audit all docs / update README examples]

**Scope**:
- Inline docs (JSDoc/docstrings): [yes/no]
- README: [yes/no]
- API reference: [yes/no]
- CHANGELOG: [yes/no]

**Output**:
1. Audit report (what's stale, what's missing)
2. Fixes (updated docs via Edit tool)
3. Verification (run doc generators, test examples)
4. Summary (what was fixed, what's still missing)
```

### Self-Execution Steps
1. **Audit**: Compare code signatures to docs, check README examples
2. **Prioritize**: Critical (wrong API docs) → High (missing docs) → Low (typos)
3. **Fix**: Update JSDoc, README, CHANGELOG
4. **Verify**: Run `npm run docs`, test README examples
5. **Summary**: List what was fixed

### Artifacts Emitted
- **Updated docs** (via Edit tool)
- **Regenerated API reference** (if applicable)
- **Audit report** (Markdown)

### When to Use
- ✅ After major release
- ✅ After refactoring
- ✅ Before publishing to npm
- ❌ Writing new docs from scratch

---

## 5. Evaluation Runner

### Command Prompt Template
```markdown
@evaluation-runner

Run eval suite: [suite name, e.g., "code-generation" or "all"]

**Compare to**: [baseline file, e.g., "results/baseline.json" or "last week"]

**Output**:
1. Per-task results (pass/fail, metrics)
2. Suite summary (pass rate, avg tokens, regressions)
3. Comparison to baseline (better/worse/same)
4. Recommendations (what to fix, what to optimize)
```

### Self-Execution Steps
1. **Discover**: Find task definitions in `.claude/evals/`
2. **Run**: For each task: execute prompt, judge result, record metrics
3. **Report**: Summarize pass/fail, metrics
4. **Compare**: Load baseline, compute deltas
5. **Analyze**: Flag regressions, identify patterns
6. **Save**: Write results to JSON + Markdown

### Artifacts Emitted
- **Results JSON**: `.claude/evals/results/[timestamp].json`
- **Results report**: `.claude/evals/results/[timestamp].md`
- (Optional) **Git commit** of results (for tracking over time)

### When to Use
- ✅ Daily/weekly regression checks
- ✅ Before releases
- ✅ After config changes
- ❌ One-off tasks

---

## Chaining Agents

### Example 1: Feature Development Pipeline
```markdown
1. @repo-cartographer - Map the codebase (if first time)
2. [Main agent] - Implement the feature
3. @evaluation-runner - Run regression tests
4. @doc-surgeon - Update README + API docs
5. [Main agent] - Create commit + PR
```

### Example 2: Bug Investigation + Fix
```markdown
1. @bug-archaeologist - Find root cause, propose fix
2. [Main agent] - Apply fix
3. @evaluation-runner - Run bug-fixing eval suite
4. @doc-surgeon - Update CHANGELOG
```

### Example 3: Large Refactor
```markdown
1. @repo-cartographer - Understand current structure
2. @refactor-commander - Execute refactor step-by-step
3. @evaluation-runner - Run regression suite
4. @doc-surgeon - Sync docs with new code
```

---

## Tips for Writing Good Agent Prompts

1. **Be specific**: "Refactor auth module" is vague. "Migrate auth from sessions to JWTs" is clear.

2. **Provide constraints**: Deadlines, backwards-compat requirements, test coverage expectations.

3. **Set expectations for output**: Do you want a plan first, or direct execution?

4. **Include context**: Link to issues, paste error messages, mention recent changes.

5. **Use checklists**: If there are multiple deliverables, list them:
   ```
   Output:
   - [ ] Code changes
   - [ ] Tests updated
   - [ ] Docs updated
   - [ ] CHANGELOG entry
   ```

6. **Specify risk tolerance**: "High-risk refactor, show diffs for approval" vs "Low-risk typo fix, just do it"

---

## Troubleshooting

**Agent doesn't activate**
→ Make sure the agent JSON is in `.claude/agents/` and the file is valid JSON.

**Agent asks for tools it doesn't have**
→ Check the `tools` list in the agent JSON; add missing tools.

**Agent produces low-quality output**
→ Refine the `systemPrompt` in the agent JSON; add examples or stricter rules.

**Agent takes too long**
→ Consider using a faster model (e.g., `claude-haiku-4` instead of `claude-sonnet-4` for simple agents).
