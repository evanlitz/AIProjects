# AI Projects

Personal AI development workspace powered by Claude Code.

## What's Here

This repository contains my AI experiments and projects, along with a production-grade Claude Code configuration.

### Claude Code Platform

Located in `.claude/` - a complete setup that transforms Claude Code from a chat add-on into a programmable development platform.

**Features**:
- 🧠 **Custom system prompt** - Enforces safe refactors, diff-first edits, conventional commits
- 🤖 **5 specialized agents** - Repo mapping, refactoring, debugging, docs, testing
- 🧪 **Eval framework** - Track quality metrics, catch regressions
- 🔧 **Auto-format hooks** - Prettier/ESLint run after every edit
- 📋 **VS Code integration** - 10 tasks + keybindings
- 📚 **Cheatsheet** - 50+ copy-paste prompts for common workflows

**Get Started**: See [.claude/ACTIVATION_GUIDE.md](.claude/ACTIVATION_GUIDE.md)

---

## Directory Structure

```
AIProjects/
├── .claude/              # Claude Code platform configuration
│   ├── claude.md         # System prompt
│   ├── agents/           # 5 specialized agents
│   ├── evals/            # Testing framework
│   ├── hooks/            # Auto-format & pre-commit
│   └── CHEATSHEET.md     # Daily driver prompts
├── .vscode/              # VS Code tasks & keybindings
├── scripts/              # Utility scripts
└── projects/             # Individual AI projects (TBD)
```

---

## Quick Start

1. **Clone this repo**:
   ```bash
   git clone https://github.com/evanlitz/AIProjects.git
   cd AIProjects
   ```

2. **Activate Claude Code platform** (20 min):
   ```bash
   # Follow the guide
   cat .claude/ACTIVATION_GUIDE.md
   ```

3. **Test it works**:
   ```bash
   # Ask Claude to run this
   ls -la .claude
   ```

---

## Projects

_Coming soon: Individual AI experiments and projects will be added to the `projects/` directory._

---

## License

MIT - Feel free to fork and adapt for your own workflow.

---

**Built with [Claude Code](https://docs.claude.com/claude-code)**
