# Crash when loading config

The CLI crashes when `config.json` is missing. This blocks release automation.

## Expected

Print a helpful error and continue with defaults.

## Actual

Unhandled exception. This is a regression from 1.2.0.
