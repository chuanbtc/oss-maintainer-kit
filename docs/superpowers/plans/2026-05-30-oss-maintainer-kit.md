# oss-maintainer-kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real, testable Node.js CLI repository for `oss-maintainer-kit` and prepare honest Codex for Open Source application materials.

**Architecture:** The CLI parses commands in `src/cli.ts`, reads inputs in `src/sources.ts`, analyzes maintainer workflows in `src/analyzers.ts`, and renders Markdown in `src/formatters.ts`. The package avoids live AI dependencies in v0.1 so tests are deterministic and the repo is immediately usable.

**Tech Stack:** Node.js 20+, TypeScript, Vitest, npm, GitHub Actions.

---

## File Structure

- `package.json`: npm package metadata, executable mapping, and scripts.
- `tsconfig.json`: TypeScript compiler settings for ESM output.
- `vitest.config.ts`: Vitest test configuration.
- `src/cli.ts`: command parsing, usage text, stdout/stderr, exit codes.
- `src/sources.ts`: local file, stdin, and public GitHub URL loading.
- `src/analyzers.ts`: deterministic issue, PR, release, and weekly report analysis.
- `src/formatters.ts`: Markdown rendering for analysis results.
- `src/index.ts`: public exports for library consumers.
- `tests/*.test.ts`: unit and integration coverage.
- `.github/workflows/ci.yml`: install, typecheck, test, and build.
- `.github/ISSUE_TEMPLATE/*.yml`: issue templates.
- `.github/pull_request_template.md`: pull request template.
- `README.md`: usage, examples, project goals, roadmap.
- `CONTRIBUTING.md`: local development and contribution process.
- `CODE_OF_CONDUCT.md`: contributor behavior standard.
- `SECURITY.md`: vulnerability reporting.
- `LICENSE`: MIT license.
- `APPLICATION.md`: Codex for Open Source application draft.

## Tasks

### Task 1: Create Package and TypeScript Scaffolding

- [ ] Create `package.json` with package metadata, `bin` entry for `omk`, and scripts for `build`, `test`, `typecheck`, and `dev`.
- [ ] Create `tsconfig.json` targeting Node ESM output in `dist`.
- [ ] Create `vitest.config.ts` for tests under `tests`.
- [ ] Create a minimal `src/index.ts` export surface.
- [ ] Run `npm install` and confirm lockfile generation.
- [ ] Commit with `chore: scaffold npm package`.

### Task 2: Implement Source Loading

- [ ] Write tests for local file reading, stdin reading, GitHub URL parsing, and unsupported source handling.
- [ ] Implement `src/sources.ts` with `readSource`, `parseGitHubUrl`, and `fetchGitHubIssue`.
- [ ] Run source tests and typecheck.
- [ ] Commit with `feat: add source loading`.

### Task 3: Implement Analysis and Formatting

- [ ] Write tests for issue, PR, release, and weekly report analysis.
- [ ] Implement deterministic analyzers with visible heuristics for priority, labels, risk, and next actions.
- [ ] Implement Markdown formatters for each command.
- [ ] Run analyzer and formatter tests.
- [ ] Commit with `feat: add maintainer analyzers`.

### Task 4: Implement CLI Commands

- [ ] Write CLI integration tests for `issue`, `pr`, `release`, `weekly`, and help output.
- [ ] Implement `src/cli.ts` command routing and executable behavior.
- [ ] Build and run the compiled binary.
- [ ] Commit with `feat: add omk cli`.

### Task 5: Add Repository Documentation and Governance

- [ ] Write README with install, commands, examples, roadmap, and project status.
- [ ] Add MIT license, contributing guide, code of conduct, and security policy.
- [ ] Add GitHub Actions CI and GitHub templates.
- [ ] Commit with `docs: prepare repository for contributors`.

### Task 6: Prepare Codex for Open Source Application

- [ ] Write `APPLICATION.md` with form-ready answers under 500 characters where required.
- [ ] Include honest notes that adoption metrics must be updated after the GitHub repository is public.
- [ ] Add a final checklist for the user: GitHub username, public repo URL, ChatGPT email, OpenAI organization ID, and actual adoption metrics.
- [ ] Commit with `docs: draft codex for oss application`.

### Task 7: Verify and Prepare GitHub Submission

- [ ] Run `npm run typecheck`, `npm test`, and `npm run build`.
- [ ] Run `node dist/cli.js --help` and sample commands against fixtures.
- [ ] Check `git status --short`.
- [ ] If GitHub CLI is authenticated, create or push to a GitHub repository named `oss-maintainer-kit`; otherwise leave exact push commands.
- [ ] Report what is complete and what personal information is still needed for the application form.

## Self-Review

The plan covers every design requirement: CLI commands, source loading, deterministic analysis, Markdown output, tests, CI, documentation, repository readiness, and application drafting. It contains no placeholder tasks and keeps v0.1 focused on a testable maintainer workflow rather than optional AI integration.
