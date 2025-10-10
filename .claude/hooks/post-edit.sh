#!/bin/bash
# Post-Edit Hook: Auto-format files after Claude edits them
#
# This hook runs after every Edit tool call.
# Environment variables available:
#   $CLAUDE_TOOL: Name of the tool that was called ("Edit")
#   $CLAUDE_FILE_PATH: Path to the file that was edited

set -e

FILE="$CLAUDE_FILE_PATH"

# Exit if no file path provided
if [ -z "$FILE" ]; then
  exit 0
fi

# Check file extension and run appropriate formatter
EXT="${FILE##*.}"

case "$EXT" in
  ts|tsx|js|jsx)
    # TypeScript/JavaScript: Use Prettier if available
    if command -v prettier &> /dev/null; then
      prettier --write "$FILE" 2>&1 | grep -v "unchanged" || true
      echo "✨ Formatted: $FILE"
    elif command -v eslint &> /dev/null; then
      eslint --fix "$FILE" 2>&1 || true
      echo "✨ Linted: $FILE"
    fi
    ;;

  py)
    # Python: Use black or autopep8
    if command -v black &> /dev/null; then
      black --quiet "$FILE" 2>&1 || true
      echo "✨ Formatted: $FILE"
    elif command -v autopep8 &> /dev/null; then
      autopep8 --in-place "$FILE" 2>&1 || true
      echo "✨ Formatted: $FILE"
    fi
    ;;

  rs)
    # Rust: Use rustfmt
    if command -v rustfmt &> /dev/null; then
      rustfmt "$FILE" 2>&1 || true
      echo "✨ Formatted: $FILE"
    fi
    ;;

  go)
    # Go: Use gofmt
    if command -v gofmt &> /dev/null; then
      gofmt -w "$FILE" 2>&1 || true
      echo "✨ Formatted: $FILE"
    fi
    ;;

  *)
    # Unknown extension, skip
    ;;
esac

exit 0
