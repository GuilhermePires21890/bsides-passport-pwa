# Contributing to Event Passport PWA

Thank you for your interest in contributing! This project is an open-source template for event organizers — every improvement benefits future events worldwide.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Branching Strategy](#branching-strategy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [What We Welcome](#what-we-welcome)
- [What to Avoid](#what-to-avoid)

---

## 🤝 Code of Conduct

This project follows a simple rule: **be respectful and constructive**.  
Harassment, discrimination, or personal attacks of any kind will not be tolerated.

---

## 🛠️ How to Contribute

### Report a Bug

1. Check [existing issues](../../issues) first
2. Open a new issue with:
   - Clear title describing the problem
   - Steps to reproduce
   - Expected vs actual behaviour
   - Environment (OS, Node version, browser)

### Suggest a Feature

1. Open an issue with the `enhancement` label
2. Describe the use case — who benefits and why
3. Keep it generic enough to work for any event, not just one specific case

### Submit a Fix or Feature

1. Fork the repo
2. Create a branch from `main` (see [Branching Strategy](#branching-strategy))
3. Make your changes
4. Run the QA tests
5. Open a Pull Request

---

## 💻 Development Setup

### Prerequisites

- Node.js 20+
- Docker
- npm

### Steps

```bash
# 1. Fork and clone
git clone https://github.com/your-username/event-passport-pwa.git
cd event-passport-pwa

# 2. Start the database
cd infra && docker compose up -d

# 3. Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run start:dev

# 4. Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Running QA Tests

Tests are in `qa-tests/` as `.http` files.  
Use the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension for VS Code, or [httpYac](https://httpyak.org/).

```
qa-tests/QA1-smoke.http       # Run first — basic connectivity
qa-tests/QA2-functional.http  # Full attendee flow
qa-tests/QA3-boundary.http    # Edge cases and limits
qa-tests/QA4-security.http    # Auth and rate limiting
```

---

## 🌿 Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable template — always deployable |
| `feat/<name>` | New features |
| `fix/<name>` | Bug fixes |
| `docs/<name>` | Documentation only |
| `chore/<name>` | Maintenance, dependencies |

**Always branch from `main`. Never push directly to `main`.**

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

---

## 📝 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/).

```
type(scope): short description
```

### Types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change without behaviour change |
| `chore` | Dependencies, tooling, maintenance |
| `test` | Test additions or changes |
| `ci` | CI/CD pipeline changes |
| `perf` | Performance improvement |

### Examples

```
feat(stamps): add duplicate scan prevention per session
fix(auth): correct token expiry calculation for staff
docs(readme): add Railway deploy guide
chore(deps): upgrade axios to 1.7.x
refactor(admin): extract dashboard stats into service layer
```

---

## 🔁 Pull Request Process

1. **Target branch**: always `main`
2. **Title**: follow commit convention (`feat(scope): description`)
3. **Description**: fill in the PR template — context, changes, how to test
4. **Tests**: confirm QA tests pass, or note which ones are affected
5. **Scope**: keep PRs focused — one concern per PR
6. **Review**: at least one approval required before merge

### PR Description Template

```markdown
## Context
Why is this change needed?

## Changes
- What was added/changed/removed

## How to Test
Step-by-step to verify the change works

## Impact
- Does this affect the database schema?
- Does this require env var changes?
- Is this a breaking change?
```

---

## ✅ What We Welcome

- Bug fixes
- Performance improvements
- Security hardening
- Better documentation and examples
- i18n improvements (new languages or better translations)
- Generic features that benefit any event (not event-specific logic)
- Better test coverage
- Accessibility improvements

---

## ❌ What to Avoid

- **Event-specific logic** — contributions must work for any event, not just one
- **Breaking changes** without prior discussion in an issue
- **Large refactors** without prior alignment — open an issue first
- **Credentials or secrets** of any kind in commits
- **`node_modules`** or build artifacts in commits

---

## 🙏 Recognition

All contributors are credited in the project. Thank you for helping make this better for the community.

---

*Built with ❤️ for the security community — originally for [BSides Your City 2026](https://yourevent.example.com)*
