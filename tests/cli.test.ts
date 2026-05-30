import { describe, expect, test } from "vitest";
import { join } from "node:path";
import { runCli } from "../src/cli.js";

const fixture = (name: string) => join("tests", "fixtures", name);

describe("runCli", () => {
  test("prints help for --help", async () => {
    const result = await runCli(["--help"]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("oss-maintainer-kit");
    expect(result.stdout).toContain("omk issue <source>");
  });

  test("generates an issue triage report", async () => {
    const result = await runCli(["issue", fixture("issue.md")]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("# Issue Triage");
    expect(result.stdout).toContain("needs-reproduction");
  });

  test("generates release notes from a source file", async () => {
    const result = await runCli(["release", "--from", fixture("changelog.md")]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("# Release Notes Draft");
    expect(result.stdout).toContain("PR review checklist generation");
  });
});
