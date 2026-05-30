import { describe, expect, test } from "vitest";
import { analyzeIssue, analyzePullRequest, analyzeRelease, analyzeWeekly } from "../src/analyzers.js";

describe("analyzeIssue", () => {
  test("classifies regressions that crash as high priority with useful labels", () => {
    const result = analyzeIssue({
      title: "Crash when loading config",
      content: "The CLI crashes when config is missing. This blocks release automation. Regression from 1.2.0."
    });

    expect(result.priority).toBe("high");
    expect(result.labels).toEqual(expect.arrayContaining(["bug", "regression", "needs-reproduction"]));
    expect(result.nextActions[0]).toContain("reproduction");
  });
});

describe("analyzePullRequest", () => {
  test("detects command and file IO risk in pull request text", () => {
    const result = analyzePullRequest({
      title: "Add release command",
      content: "This changes command routing and file IO. Testing includes unit tests."
    });

    expect(result.riskLevel).toBe("medium");
    expect(result.riskAreas).toEqual(expect.arrayContaining(["command routing", "file IO"]));
    expect(result.mergeReadiness).toContain("Review");
  });
});

describe("analyzeRelease", () => {
  test("groups changelog bullets into release note sections", () => {
    const result = analyzeRelease({
      title: "Changelog",
      content: "- Added PR review checklist generation.\n- Fixed release note formatting.\n- Improved issue label suggestions."
    });

    expect(result.highlights).toEqual(["PR review checklist generation."]);
    expect(result.fixes).toEqual(["release note formatting."]);
    expect(result.improvements).toEqual(["issue label suggestions."]);
  });
});

describe("analyzeWeekly", () => {
  test("summarizes multiple maintainer notes into a weekly report", () => {
    const result = analyzeWeekly([
      { title: "issues.md", content: "- Fixed crash\n- Triaged 4 issues" },
      { title: "prs.md", content: "- Reviewed release command PR" }
    ]);

    expect(result.sources).toEqual(["issues.md", "prs.md"]);
    expect(result.completed).toEqual(expect.arrayContaining(["Fixed crash", "Reviewed release command PR"]));
    expect(result.focusNextWeek[0]).toContain("Follow up");
  });
});
