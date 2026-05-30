# oss-maintainer-kit

`oss-maintainer-kit` is a command-line toolkit for open source maintainers. It drafts practical maintainer artifacts from local files, stdin, or public GitHub issue and pull request URLs:

- issue triage summaries
- pull request review checklists
- release notes drafts
- weekly maintainer reports

The first release is deterministic and does not require an AI API key. That makes the tool easy to run in CI, easy to test, and safe to use on public project material. Future versions can add optional OpenAI-powered summarization without changing the command workflow.

## Install

```bash
npm install
npm run build
npm link
```

Then run:

```bash
omk --help
```

## Usage

```bash
omk issue tests/fixtures/issue.md
omk pr tests/fixtures/pr.md
omk release --from tests/fixtures/changelog.md
omk weekly tests/fixtures/issue.md tests/fixtures/pr.md
```

You can also use stdin:

```bash
cat issue.md | omk issue -
```

Public GitHub issue and pull request URLs are supported:

```bash
omk issue https://github.com/owner/repo/issues/123
omk pr https://github.com/owner/repo/pull/456
```

Set `GITHUB_TOKEN` to increase GitHub API rate limits:

```bash
GITHUB_TOKEN=ghp_example omk issue https://github.com/owner/repo/issues/123
```

## Commands

### `omk issue <source>`

Creates:

- priority suggestion
- label suggestions
- issue summary
- next actions
- maintainer response draft

### `omk pr <source>`

Creates:

- risk level
- risk areas
- review checklist
- testing notes
- merge readiness guidance

### `omk release --from <source>`

Creates release note sections for highlights, fixes, improvements, and other notes.

### `omk weekly <source...>`

Creates a maintainer weekly report across multiple notes, issue summaries, or PR summaries.

## Project Status

This is an early open source maintainer workflow project. Version 0.1 focuses on a reliable local CLI, tests, and public GitHub input support. The roadmap is:

- optional OpenAI provider for richer summaries
- GitHub label and milestone suggestions
- repository health reports
- release checklist generation
- GitHub Action mode for scheduled maintainer reports

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Contributing

Contributions are welcome. Please start with a focused issue or pull request and include tests for behavior changes.

## License

MIT
