# Manual Eval Checklist

**Purpose**: Track Claude Code performance on key tasks manually
**When to run**: Weekly or after major config changes
**How to use**: Run each task, mark pass/fail, note issues

---

## **Eval Session Template**

**Date**: _________
**Config version**: (git commit hash or date of last `.claude/claude.md` change)
**Notes**: Any recent changes to system prompt, permissions, etc.

---

## **Task 1: Code Generation (code-gen-001)**

**Prompt to give Claude**:
```
Write a TypeScript function `deepClone<T>(obj: T): T` that creates a deep copy of an object.

Requirements:
- Handle nested objects and arrays
- Preserve type information
- Do not use external libraries (JSON.parse/stringify is fine)
- Handle edge cases: null, undefined, primitives

Place the implementation in a file called `deepClone.ts`.
```

**Success criteria**:
- [ ] Function signature matches `deepClone<T>(obj: T): T`
- [ ] TypeScript compiles without errors
- [ ] Handles nested objects
- [ ] Handles arrays
- [ ] Handles null/undefined
- [ ] No external dependencies

**Result**: ☐ Pass | ☐ Fail | ☐ Partial

**Notes**: ________________________________

**Metrics**:
- Time to complete: _____ seconds
- Number of back-and-forth messages: _____
- Number of edits required: _____

---

## **Task 2: Refactoring (refactor-001)**

**Setup**: Create a test file with poorly formatted code:
```javascript
// messy-code.js
function processUser(u){const n=u.name.toUpperCase();const e=u.email;return{name:n,email:e,timestamp:Date.now()};}
```

**Prompt to give Claude**:
```
Refactor messy-code.js to:
1. Use proper spacing and formatting
2. Add type annotations (convert to TypeScript)
3. Extract magic values to constants
4. Add JSDoc comments
5. Maintain the same functionality

Show me the plan first, then execute step by step.
```

**Success criteria**:
- [ ] Shows a plan before executing
- [ ] Applies changes incrementally
- [ ] Properly formatted
- [ ] TypeScript types added
- [ ] JSDoc comments added
- [ ] Functionality preserved

**Result**: ☐ Pass | ☐ Fail | ☐ Partial

**Notes**: ________________________________

**Metrics**:
- Time to complete: _____ seconds
- Number of steps: _____
- Did it ask for approval before applying? ☐ Yes ☐ No

---

## **Task 3: Bug Fixing (bug-fix-001)**

**Setup**: Use the buggy file we created earlier (`buggy-user-service.js`)

**Prompt to give Claude**:
```
The file buggy-user-service.js has a bug: it crashes when adding users with null emails (e.g., OAuth users).

Error: TypeError: Cannot read property 'toLowerCase' of undefined

Please:
1. Reproduce the bug
2. Write a failing test
3. Fix the bug
4. Verify the test passes
```

**Success criteria**:
- [ ] Identifies the root cause
- [ ] Writes a failing test first
- [ ] Fixes the bug
- [ ] Test passes after fix
- [ ] Explains the fix clearly

**Result**: ☐ Pass | ☐ Fail | ☐ Partial

**Notes**: ________________________________

**Metrics**:
- Time to complete: _____ seconds
- Root cause identified correctly? ☐ Yes ☐ No
- Test written before fix? ☐ Yes ☐ No

---

## **Task 4: Code Navigation (navigation-001)**

**Prompt to give Claude**:
```
Using the code map you generated earlier, tell me:
1. Where should I add a new VS Code task?
2. Where is the system prompt stored?
3. What agents are available and what do they do?

Answer using file references (clickable links).
```

**Success criteria**:
- [ ] Correctly identifies `.vscode/tasks.json`
- [ ] Correctly identifies `.claude/claude.md`
- [ ] Lists all 5 agents with descriptions
- [ ] Uses markdown links for file references

**Result**: ☐ Pass | ☐ Fail | ☐ Partial

**Notes**: ________________________________

---

## **Task 5: Git Workflow (git-001)**

**Prompt to give Claude**:
```
Stage all changes and create a commit with a conventional commit message for the work we've done today.
```

**Success criteria**:
- [ ] Runs `git status` first
- [ ] Shows what will be committed
- [ ] Creates a proper conventional commit message
- [ ] Includes the Claude Code footer
- [ ] Doesn't push without asking

**Result**: ☐ Pass | ☐ Fail | ☐ Partial

**Notes**: ________________________________

---

## **Summary Scorecard**

**Pass rate**: ___/5 tasks passed
**Avg time per task**: _____ seconds
**Issues found**:
- ______________________________
- ______________________________

**Improvements since last eval**:
- ______________________________
- ______________________________

**Action items**:
- [ ] ______________________________
- [ ] ______________________________

---

## **Comparison to Previous Run**

| Task | Previous | This Run | Trend |
|------|----------|----------|-------|
| Code Gen | ☐ Pass | ☐ Pass | ↑↓→ |
| Refactor | ☐ Pass | ☐ Pass | ↑↓→ |
| Bug Fix | ☐ Pass | ☐ Pass | ↑↓→ |
| Navigation | ☐ Pass | ☐ Pass | ↑↓→ |
| Git Workflow | ☐ Pass | ☐ Pass | ↑↓→ |

**Legend**: ↑ Improved | ↓ Regressed | → No change

---

**Next eval date**: __________
