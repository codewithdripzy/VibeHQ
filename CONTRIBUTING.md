# Contributing to VibeHQ

Thank you for your interest in contributing to VibeHQ! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to **[INSERT CONTACT METHOD]**.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment (see below)
4. Create a branch for your changes
5. Make your changes
6. Test your changes
7. Commit and push to your fork
8. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18+ (recommended: 20+)
- pnpm 8+ (recommended: latest)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/anomalyco/vibehq.git
cd vibehq

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development servers
pnpm dev
```

### Available Commands

```bash
# Start all development servers
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Run tests
pnpm test

# Clean build artifacts
pnpm clean
```

## Project Structure

```
vibehq/
├── ARCHITECTURE.md          # System architecture documentation
├── CODE_OF_CONDUCT.md       # Community guidelines
├── CONTRIBUTING.md          # This file
├── README.md                # Project overview
├── SECURITY.md              # Security policy
├── server/                  # Backend services
│   ├── src/
│   │   ├── api/            # API routes and handlers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models
│   │   └── utils/          # Utility functions
│   └── package.json
├── web/                     # Frontend application
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── components/     # React components
│   │   └── lib/            # Utility libraries
│   └── package.json
└── package.json             # Root package.json
```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, include:

1. **Title**: A clear, descriptive title
2. **Environment**: OS, browser, Node.js version, pnpm version
3. **Steps to Reproduce**: Detailed steps to reproduce the issue
4. **Expected Behavior**: What you expected to happen
5. **Actual Behavior**: What actually happened
6. **Screenshots**: If applicable, add screenshots to help explain
7. **Additional Context**: Any other relevant information

### Suggesting Features

Feature suggestions are welcome. Please provide:

1. **Title**: A clear, descriptive title
2. **Problem**: Describe the problem your feature would solve
3. **Solution**: Describe your preferred solution
4. **Alternatives**: Describe any alternative solutions considered
5. **Use Cases**: Explain how this feature would be used

### Contributing Code

1. **Find or Create an Issue**: Look for existing issues or create a new one
2. **Claim the Issue**: Comment on the issue to let others know you're working on it
3. **Create a Branch**: Create a feature branch from `main`
4. **Write Code**: Follow our coding standards
5. **Write Tests**: Add tests for new functionality
6. **Update Documentation**: Update relevant documentation
7. **Submit PR**: Create a pull request with a clear description

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Documentation is updated (if applicable)
- [ ] Commit messages follow our guidelines

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist

- [ ] My code follows the project style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code (if needed)
- [ ] I have updated documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

### Review Process

1. All submissions require review before merging
2. Maintainers may request changes
3. Once approved, a maintainer will merge the PR
4. Delete your feature branch after merging

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint rules configured in the project
- Use functional components with hooks
- Write self-documenting code with meaningful names
- Keep functions small and focused

### CSS/Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Use semantic class names
- Ensure responsive design
- Test accessibility

### Testing

- Write unit tests for utilities and services
- Write integration tests for API endpoints
- Aim for meaningful test coverage
- Test edge cases and error scenarios

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```
feat(auth): add JWT authentication
fix(api): handle null response from external service
docs(readme): update installation instructions
refactor(db): optimize database queries
```

## Reporting Bugs

Use GitHub Issues to report bugs. Include:

1. **Title**: Brief, descriptive title
2. **Environment**: OS, browser, Node.js version
3. **Steps to Reproduce**: Clear steps
4. **Expected vs Actual**: What happened vs what should happen
5. **Screenshots**: Visual evidence if applicable
6. **Logs**: Console errors or stack traces

## Requesting Features

Use GitHub Issues with the "enhancement" label. Include:

1. **Problem**: What problem does this solve?
2. **Solution**: Proposed solution
3. **Alternatives**: Other approaches considered
4. **Use Cases**: How would this be used?
5. **Priority**: How important is this feature?

## Getting Help

- **Documentation**: Check README.md and ARCHITECTURE.md
- **Issues**: Search existing issues for answers
- **Discussions**: Use GitHub Discussions for questions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
