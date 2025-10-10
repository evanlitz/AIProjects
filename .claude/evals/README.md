# Claude Code Evaluation Framework

## Purpose
Measure Claude Code's performance on representative tasks from your workflows. Track metrics over time to detect regressions and improvements.

## Directory Structure

```
.claude/evals/
├── tasks/           # Task definitions (YAML)
│   ├── code-gen-001.yaml
│   ├── refactor-001.yaml
│   └── bug-fix-001.yaml
├── oracles/         # Expected outputs (reference implementations, gold standards)
│   ├── code-gen-001-expected.ts
│   └── refactor-001-expected-diff.txt
├── results/         # Eval run results (JSON + Markdown reports)
│   ├── baseline.json
│   ├── 2025-10-09.json
│   └── 2025-10-09.md
├── scripts/         # Runner scripts
│   └── run-eval.js
└── README.md        # This file
```

---

## Task Definition Format

Each task is a YAML file:

```yaml
id: code-gen-001
category: code-generation
description: "Implement a function to validate email addresses"
difficulty: easy  # easy | medium | hard

input:
  prompt: |
    Write a TypeScript function `isValidEmail(email: string): boolean`
    that validates email format using a regex.
    Do not use external libraries.

  context:
    files: []  # Optional: files to provide as context
    env: {}    # Optional: environment variables

oracle:
  type: reference-implementation  # or: test-suite | rubric
  file: ../oracles/code-gen-001-expected.ts
  tests: ../oracles/code-gen-001.test.ts  # Optional

acceptance:
  criteria:
    - id: signature
      description: "Function signature matches: isValidEmail(email: string): boolean"
      weight: 10
    - id: tests-pass
      description: "All tests in code-gen-001.test.ts pass"
      weight: 50
    - id: no-deps
      description: "No external dependencies added"
      weight: 10
    - id: handles-edge-cases
      description: "Handles: empty string, null, whitespace, unicode"
      weight: 30

  min_passing_score: 70  # Out of 100 (sum of weights)

metrics:
  track:
    - tokens_used
    - wall_time_sec
    - edits_count
    - test_pass_rate
    - compile_success
```

---

## KPIs (Key Performance Indicators)

### Per-Task Metrics
- **Task success rate**: Pass/fail/partial
- **Tokens used**: Total tokens consumed
- **Wall time**: Seconds from prompt to completion
- **Edit count**: Number of file edits
- **Compile/test pass rate**: % of tests passing
- **Diff size**: Lines added/removed (for refactors)

### Suite-Level Metrics
- **Pass rate**: X/N tasks passed
- **Avg tokens per task**: Mean token consumption
- **Avg time per task**: Mean wall time
- **Regression count**: Tasks that passed before but fail now
- **Improvement count**: Tasks that failed before but pass now

### Trend Metrics (Over Time)
- **Token efficiency**: Tokens per successful task (lower is better)
- **Speed**: Seconds per task (lower is better)
- **Quality drift**: Pass rate trend (should stay stable or improve)

---

## Running Evals

### Option 1: Via Evaluation Runner Agent
```
@evaluation-runner run suite: all
@evaluation-runner compare to: results/baseline.json
```

### Option 2: Via CLI Script (Node)
```bash
node .claude/evals/scripts/run-eval.js --suite all --compare results/baseline.json
```

### Option 3: Manual (for debugging)
```bash
# Run a single task
cat .claude/evals/tasks/code-gen-001.yaml
# Copy prompt, paste to Claude, capture output
# Run acceptance tests manually
npm test code-gen-001.test.ts
```

---

## Interpreting Results

### Result JSON Format
```json
{
  "run_id": "2025-10-09T12:00:00Z",
  "config": {
    "model": "claude-sonnet-4",
    "settings": ".claude/claude.md",
    "mcp_servers": ["filesystem", "git"]
  },
  "tasks": [
    {
      "id": "code-gen-001",
      "status": "pass",
      "score": 100,
      "metrics": {
        "tokens_used": 1200,
        "wall_time_sec": 8,
        "edits_count": 1,
        "compile_success": true,
        "tests_passed": 5,
        "tests_failed": 0
      },
      "acceptance": {
        "signature": { "pass": true, "score": 10 },
        "tests-pass": { "pass": true, "score": 50 },
        "no-deps": { "pass": true, "score": 10 },
        "handles-edge-cases": { "pass": true, "score": 30 }
      }
    }
  ],
  "summary": {
    "total_tasks": 5,
    "passed": 4,
    "failed": 1,
    "partial": 0,
    "pass_rate": 0.8,
    "avg_tokens": 1450,
    "avg_time_sec": 12,
    "total_tokens": 7250,
    "total_time_sec": 60
  }
}
```

### Comparison Report (Baseline vs Current)
```markdown
## Eval Comparison: Baseline → 2025-10-09

**Pass rate**: 80% (was 100%) ⚠️ **Regression**
**Avg tokens**: 1,450 (was 1,200) ⚠️ **+20% token usage**
**Avg time**: 12s (was 10s) ⚠️ **+20% slower**

### Regressions (passed → failed)
- **code-gen-003**: Now fails on edge case (unicode emails)
  - Root cause: Regex doesn't handle unicode domains
  - Action: Update prompt to specify unicode support

### New Failures
- None

### Improvements (failed → passed)
- None

### Recommendations
1. **Fix regression**: Investigate code-gen-003 (check if claude.md change caused this)
2. **Optimize tokens**: Tasks 002 and 005 use 2x more tokens than others (check for redundant file reads)
```

---

## Before/After Workflow

### Establishing a Baseline
1. **Initial setup**: Create 5–10 representative tasks
2. **Run evals**: `node run-eval.js --suite all --output results/baseline.json`
3. **Review**: Check pass rate, token usage, time
4. **Commit**: `git add .claude/evals/results/baseline.json && git commit -m "Add eval baseline"`

### After Upgrading (Settings/MCP/Agents)
1. **Make changes**: Update `.claude/claude.md`, install MCP servers, add agents
2. **Run evals**: `node run-eval.js --suite all --compare results/baseline.json --output results/2025-10-09.json`
3. **Review comparison**: Did pass rate improve? Are tokens/time lower?
4. **Decide**:
   - ✅ **If better**: Keep changes, update baseline
   - ❌ **If worse**: Revert changes, investigate why
   - ⚠️ **If mixed**: Keep changes that help, revert those that hurt

### Tracking Over Time
- Run evals weekly (or after major changes)
- Commit results to git
- Use a simple script to plot trends:
  ```bash
  # Extract pass rates from all result files
  jq '.summary.pass_rate' .claude/evals/results/*.json
  ```

---

## Sample Tasks (Included)

### 1. Code Generation (Easy)
**Task**: Implement a type-safe deep clone function
**Criteria**: Compiles, handles nested objects, passes 10 test cases
**File**: `tasks/code-gen-001.yaml`

### 2. Refactoring (Medium)
**Task**: Convert callback-based API to async/await
**Criteria**: All tests still pass, no new bugs, uses async/await correctly
**File**: `tasks/refactor-001.yaml`

### 3. Bug Fix (Medium)
**Task**: Fix a null pointer exception in user authentication
**Criteria**: Failing test now passes, root cause explained, edge cases covered
**File**: `tasks/bug-fix-001.yaml`

---

## Customizing for Your Codebase

### Step 1: Identify Representative Tasks
Pick 5–10 tasks that match your daily workflows:
- If you do lots of API work → add tasks for endpoint creation, validation, error handling
- If you refactor often → add tasks for renaming, migrating patterns
- If you fix bugs → add tasks for debugging, root-cause analysis

### Step 2: Create Oracles
For each task:
- **Reference implementation**: Write the ideal solution yourself
- **Test suite**: Create tests that verify correctness
- **Rubric**: If no clear "right answer," define scoring criteria

### Step 3: Set Acceptance Thresholds
- **Easy tasks**: 90%+ pass rate expected
- **Medium tasks**: 70%+ pass rate
- **Hard tasks**: 50%+ pass rate (or just track improvement over time)

### Step 4: Automate
- Add to CI: Run evals on every claude.md change
- Add to weekly cron: Track quality drift over time

---

## Tools Provided

### `scripts/run-eval.js`
Node.js script that:
- Loads task definitions
- Invokes Claude (via Task tool or API)
- Runs acceptance checks (compile, test, diff)
- Records metrics
- Generates JSON + Markdown reports

### `scripts/compare-results.js`
Compares two result files and outputs diff (regressions, improvements, metrics deltas).

### `scripts/plot-trends.js`
Generates a simple ASCII chart of pass rate / tokens / time over multiple runs.

---

## FAQ

**Q: How many tasks should I create?**
A: Start with 5 (one per category: code-gen, refactor, bug-fix, docs, test). Add more as you find gaps.

**Q: How often should I run evals?**
A: Weekly for routine checks, immediately after config changes.

**Q: What if a task is flaky (sometimes passes, sometimes fails)?**
A: Either fix the task (make it deterministic), or run it 3 times and take the majority result.

**Q: Can I use this for non-code tasks?**
A: Yes. Example: "Write a PR description from a diff" (oracle = human-written description, criteria = includes summary, lists changes, mentions risks).

**Q: How do I track token costs?**
A: Record `tokens_used` per task, multiply by your model's cost per token (e.g., Sonnet 4 is ~$3/MTok input, $15/MTok output).

---

## Next Steps
- Create your first 3 tasks (see `/tasks/` for examples)
- Run the baseline eval
- Make a config change (e.g., update claude.md)
- Re-run and compare
