# Contributing

Thanks for helping improve `oss-maintainer-kit`.

## Local Setup

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Pull Requests

Please keep pull requests focused. A good PR includes:

- a short explanation of the maintainer workflow it improves
- tests for behavior changes
- updated documentation when commands or output change

## Development Notes

The first release uses deterministic heuristics instead of a live AI API. This keeps tests reliable and makes the CLI safe to run in public CI. Optional AI providers should be added behind explicit configuration and should not change default offline behavior.
