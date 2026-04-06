# Contributing to mirabile

Thank you for your interest in contributing to **mirabile** — an AI-powered career roadmap that helps users build personalized learning paths. We welcome contributions of all kinds and appreciate the time and effort you put into making this project better.

This document provides guidelines and expectations for contributors to ensure a respectful, productive, and professional environment for everyone.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Setting Up the Project](#setting-up-the-project)
  - [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
  - [Finding an Issue](#finding-an-issue)
  - [Self-Assigning an Issue](#self-assigning-an-issue)
  - [Proposing New Features](#proposing-new-features)
- [Development Workflow](#development-workflow)
  - [Branching and Committing](#branching-and-committing)
  - [Pull Requests](#pull-requests)
- [Code Standards](#code-standards)
- [Communication Guidelines](#communication-guidelines)

---

## Code of Conduct

We are committed to providing a welcoming and harassment-free environment for everyone. By participating in this project, you agree to:

- **Be respectful**: Treat others with courtesy, regardless of experience level or background.
- **Be constructive**: Offer actionable feedback and suggestions. Avoid dismissive or vague criticism.
- **Be inclusive**: Use welcoming language and be open to different perspectives.
- **Be professional**: Keep discussions focused on the code and the project's goals. Personal attacks, trolling, and harassment will not be tolerated.

Unacceptable behavior may be reported via the [project's issue tracker](https://github.com/Stewie-pixel/mirabile/issues). Project maintainers reserve the right to remove comments, issues, or contributions that violate these guidelines.

---

## Getting Started

### Setting Up the Project

This is a monorepo with two packages:

**Backend (server/):**
```bash
cd server
npm install
node index.js          # Starts the API server on port 5000
```

**Frontend (client/):**
```bash
cd client
npm install
npm start              # Starts the dev server on port 3000
npm test               # Runs tests in watch mode
```

The frontend communicates with the backend at `http://localhost:5000`.

### Project Structure

```
client/       — React 19 frontend (create-react-app)
server/       — Express 5 backend API
```

---

## How to Contribute

### Finding an Issue

- Browse [open issues](https://github.com/Stewie-pixel/mirabile/issues) on GitHub.
- Issues labeled **"help wanted"** are available for contributors to pick up.
- If you're new to the project, look for issues labeled **"good first issue"**.

### Self-Assigning an Issue

We use an automated assignment system via GitHub Actions:

1. Comment `/assign` on an issue with the **"help wanted"** label to assign it to yourself.
2. You may have up to **3 open issues** assigned at a time.
3. If you need to step away, comment `/unassign` to release the issue so others can pick it up.

If an issue is already assigned, please reach out to the assignee before requesting it be reassigned.

### Proposing New Features

Before starting work on a new feature, please open an issue first to discuss the idea. This helps avoid duplicate effort and ensures the feature aligns with the project's goals.

---

## Development Workflow

### Branching and Committing

- Create a new branch for your work: `git checkout -b feat/your-feature-name` or `fix/your-bug-fix`.
- Write **clear, descriptive commit messages** that explain *what* and *why*, not just *how*.
- Keep commits focused — avoid bundling unrelated changes together.

### Pull Requests

1. **Create a PR** against the `main` branch with a clear title and description.
2. **Link related issues** in the PR description (e.g., `Closes #123`).
3. **Describe your changes**: What problem does this solve? How does it work?
4. **Include screenshots or recordings** for UI changes.
5. **Ensure tests pass** (`npm test` in the `client/` directory).
6. Be responsive to review feedback. Reviewers aim to be constructive, and we ask the same from authors receiving feedback.

---

## Code Standards

- Follow the existing code style in the project.
- Write meaningful variable and function names.
- Add comments only where the logic isn't self-evident — prefer clear code over explanatory comments.
- Write tests for new features and bug fixes.
- Do not introduce new dependencies without discussing in the issue or PR first.

---

## Communication Guidelines

- **Issues**: Use the issue tracker for bug reports, feature requests, and documentation improvements. Be specific and include steps to reproduce where applicable.
- **Pull Requests**: Keep discussions focused on the changes at hand. If a broader topic emerges, suggest opening a new issue.
- **Reviews**: Provide specific, actionable feedback. Instead of "this is wrong," explain *what* is wrong and *how* it could be improved.
- **Patience**: Maintainers and reviewers may have limited availability. Please allow reasonable time for responses before following up.

---

Thank you for contributing to mirabile. Every contribution, big or small, makes a difference.
