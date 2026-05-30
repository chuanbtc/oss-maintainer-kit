import { describe, expect, test } from "vitest";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseGitHubUrl, readSource } from "../src/sources.js";

describe("parseGitHubUrl", () => {
  test("parses public issue and pull request URLs", () => {
    expect(parseGitHubUrl("https://github.com/openai/codex/issues/42")).toEqual({
      owner: "openai",
      repo: "codex",
      number: 42,
      kind: "issue"
    });

    expect(parseGitHubUrl("https://github.com/openai/codex/pull/7")).toEqual({
      owner: "openai",
      repo: "codex",
      number: 7,
      kind: "pull"
    });
  });

  test("rejects non GitHub issue or pull request URLs", () => {
    expect(parseGitHubUrl("https://example.com/openai/codex/issues/42")).toBeNull();
    expect(parseGitHubUrl("https://github.com/openai/codex")).toBeNull();
  });
});

describe("readSource", () => {
  test("reads a local markdown file into a source document", async () => {
    const dir = await mkdtemp(join(tmpdir(), "omk-"));
    const file = join(dir, "issue.md");
    await writeFile(file, "# Issue\n\nA regression crashes the CLI.");

    await expect(readSource(file)).resolves.toEqual({
      kind: "file",
      title: "issue.md",
      content: "# Issue\n\nA regression crashes the CLI.",
      url: undefined
    });
  });
});
