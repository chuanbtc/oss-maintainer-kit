#!/usr/bin/env node
import { argv, exit, stderr, stdout } from "node:process";
import { analyzeIssue, analyzePullRequest, analyzeRelease, analyzeWeekly } from "./analyzers.js";
import {
  formatIssueReport,
  formatPullRequestReport,
  formatReleaseReport,
  formatWeeklyReport
} from "./formatters.js";
import { readSource } from "./sources.js";

export type CliResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

export async function runCli(args: string[]): Promise<CliResult> {
  try {
    const [command, ...rest] = args;

    if (!command || command === "--help" || command === "-h") {
      return ok(helpText());
    }

    if (command === "issue") {
      const source = required(rest[0], "Usage: omk issue <source>");
      const document = await readSource(source);
      return ok(formatIssueReport(analyzeIssue({ title: document.title, content: document.content })));
    }

    if (command === "pr") {
      const source = required(rest[0], "Usage: omk pr <source>");
      const document = await readSource(source);
      return ok(formatPullRequestReport(analyzePullRequest({ title: document.title, content: document.content })));
    }

    if (command === "release") {
      const source = optionValue(rest, "--from");
      const document = await readSource(source);
      return ok(formatReleaseReport(analyzeRelease({ title: document.title, content: document.content })));
    }

    if (command === "weekly") {
      if (rest.length === 0) {
        throw new Error("Usage: omk weekly <source...>");
      }
      const documents = await Promise.all(rest.map((source) => readSource(source)));
      return ok(formatWeeklyReport(analyzeWeekly(documents.map((document) => ({
        title: document.title,
        content: document.content
      })))));
    }

    throw new Error(`Unknown command "${command}".\n\n${helpText()}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      exitCode: 1,
      stdout: "",
      stderr: `${message}\n`
    };
  }
}

function ok(output: string): CliResult {
  return {
    exitCode: 0,
    stdout: `${output.trimEnd()}\n`,
    stderr: ""
  };
}

function required(value: string | undefined, usage: string): string {
  if (!value) {
    throw new Error(usage);
  }
  return value;
}

function optionValue(args: string[], name: string): string {
  const index = args.indexOf(name);
  if (index === -1 || !args[index + 1]) {
    throw new Error(`Usage: omk release ${name} <source>`);
  }
  return args[index + 1];
}

export function helpText(): string {
  return `oss-maintainer-kit

Usage:
  omk issue <source>           Draft issue triage guidance
  omk pr <source>              Draft pull request review guidance
  omk release --from <source>  Draft release notes
  omk weekly <source...>       Draft a weekly maintainer report

Sources:
  Local file path, "-" for stdin, or a public GitHub issue / pull request URL.

Environment:
  GITHUB_TOKEN  Optional token for GitHub API requests.`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await runCli(argv.slice(2));
  if (result.stdout) {
    stdout.write(result.stdout);
  }
  if (result.stderr) {
    stderr.write(result.stderr);
  }
  exit(result.exitCode);
}
