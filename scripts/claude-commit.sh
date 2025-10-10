#!/bin/bash
# Wrapper script for creating commits with Claude
# Usage: ./scripts/claude-commit.sh

set -e

echo "🤖 Generating commit message with Claude..."

# Check if there are staged changes
if ! git diff --cached --quiet; then
  # Generate commit message
  MESSAGE=$(cat <<'EOF'
Review the staged changes and generate a conventional commit message.
Format:
type(scope): short summary

- Bullet points explaining why (not what)
- Focus on user impact or architectural reasoning

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)

  echo "$MESSAGE" | claude-code --quiet > /tmp/claude-commit-msg.txt

  # Show the message
  echo ""
  echo "📝 Proposed commit message:"
  echo "---"
  cat /tmp/claude-commit-msg.txt
  echo "---"
  echo ""

  # Ask for confirmation
  read -p "Proceed with this commit? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git commit -F /tmp/claude-commit-msg.txt
    echo "✅ Committed"
  else
    echo "❌ Commit cancelled"
    exit 1
  fi

  rm /tmp/claude-commit-msg.txt
else
  echo "No staged changes. Run 'git add' first."
  exit 1
fi
