#!/bin/bash
# Pre-Commit Hook: Block commits with common issues
#
# This hook runs before git commit.
# Environment variables available:
#   $CLAUDE_TOOL: "Bash"
#   $CLAUDE_COMMAND: The git command being run

set -e

echo "🔍 Running pre-commit checks..."

# Check for common mistakes
ERRORS=0

# 1. Check for hardcoded secrets (basic patterns)
if git diff --cached | grep -iE '(api[_-]?key|secret|password|token)\s*=\s*["\047][^"\047]{8,}'; then
  echo "❌ Possible hardcoded secret detected in staged files"
  echo "   Please use environment variables instead"
  ERRORS=$((ERRORS + 1))
fi

# 2. Check for debug statements (console.log, print, etc.)
if git diff --cached --name-only | grep -E '\.(ts|js|tsx|jsx)$' | xargs grep -n 'console\.log' 2>/dev/null; then
  echo "⚠️  Warning: console.log statements found (consider removing for production)"
  # Don't block, just warn
fi

# 3. Check for TODO/FIXME in new code (warn only)
if git diff --cached | grep -E '^\+.*\b(TODO|FIXME|XXX)\b'; then
  echo "⚠️  Warning: New TODO/FIXME comments added"
  # Don't block, just warn
fi

# 4. Run linter if available (only on staged files)
if command -v eslint &> /dev/null; then
  STAGED_JS_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|js|tsx|jsx)$' || true)
  if [ -n "$STAGED_JS_FILES" ]; then
    echo "🔍 Running ESLint on staged files..."
    if ! echo "$STAGED_JS_FILES" | xargs eslint --max-warnings 0; then
      echo "❌ ESLint errors found. Fix them or use --no-verify to bypass."
      ERRORS=$((ERRORS + 1))
    fi
  fi
fi

# 5. Run type check if available
if command -v tsc &> /dev/null && [ -f tsconfig.json ]; then
  echo "🔍 Running TypeScript type check..."
  if ! tsc --noEmit; then
    echo "❌ TypeScript errors found. Fix them or use --no-verify to bypass."
    ERRORS=$((ERRORS + 1))
  fi
fi

# Exit with error if checks failed
if [ $ERRORS -gt 0 ]; then
  echo ""
  echo "❌ Pre-commit checks failed ($ERRORS errors)"
  echo "   Fix the issues above or use 'git commit --no-verify' to bypass"
  exit 1
fi

echo "✅ Pre-commit checks passed"
exit 0
