# oss-maintainer-kit Design

## Purpose

`oss-maintainer-kit` is an open source command-line tool for maintainers who need fast, repeatable drafts for issue triage, pull request review, release notes, and weekly project reports. The first version focuses on local and public GitHub inputs so the tool is useful without storing user data or requiring an OpenAI key.

## Users

The primary user is an open source maintainer who reviews issues and pull requests, prepares releases, and communicates project status. The project should be easy to run locally, easy to test in CI, and clear enough for contributors to extend.

## Product Scope

Version 0.1 provides four commands:

- `omk issue <source>` generates a triage summary with priority, labels, next actions, and a maintainer response draft.
- `omk pr <source>` generates a review checklist with risk areas, testing notes, and merge readiness.
- `omk release --from <source>` generates release notes from a changelog, commit list, or markdown file.
- `omk weekly <source...>` generates a maintainer weekly report from one or more local files.

`<source>` can be a local file, `-` for stdin, or a public GitHub issue or pull request URL. GitHub access uses unauthenticated requests by default and uses `GITHUB_TOKEN` when it is available.

## Architecture

The CLI is a small Node.js package using TypeScript and ESM. The command layer parses arguments and delegates to focused modules:

- `src/cli.ts` handles command routing, usage text, output, and exit codes.
- `src/sources.ts` reads local files, stdin, and GitHub issue or pull request URLs.
- `src/analyzers.ts` turns normalized text into structured maintainer guidance.
- `src/formatters.ts` renders the structured analysis as Markdown.

The first release deliberately avoids a live OpenAI dependency. The generated output is deterministic and testable. Future versions can add optional OpenAI-powered summarization behind a provider interface without changing the CLI contract.

## Data Flow

The CLI receives a command and source, `sources.ts` loads text plus lightweight metadata, `analyzers.ts` classifies the content with transparent heuristics, and `formatters.ts` returns Markdown. Errors are returned with practical guidance, such as how to pass a file, stdin, or `GITHUB_TOKEN`.

## Error Handling

The CLI exits with code `0` on success and `1` on user-facing failures. Missing arguments, unreadable files, invalid GitHub URLs, and failed GitHub requests produce concise error messages. The tool never writes to the network except when a GitHub URL is provided.

## Testing

Tests cover command routing, source loading, GitHub URL parsing, analysis heuristics, and Markdown output. CI runs install, typecheck, tests, and build on every push and pull request.

## Repository Readiness

The repository includes a README, license, contributing guide, code of conduct, security policy, GitHub Actions workflow, issue templates, PR template, and an application draft for Codex for Open Source. The application draft is honest about the project being new and frames the request around future maintenance automation, not fabricated adoption metrics.
