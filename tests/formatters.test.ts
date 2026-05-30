import { describe, expect, test } from "vitest";
import { formatIssueReport, formatPullRequestReport } from "../src/formatters.js";

describe("formatIssueReport", () => {
  test("renders issue triage guidance as markdown", () => {
    const markdown = formatIssueReport({
      title: "Crash when loading config",
      priority: "high",
      labels: ["bug", "regression"],
      summary: "The CLI crashes when config is missing.",
      nextActions: ["Ask for a minimal reproduction."],
      responseDraft: "Thanks for the report."
    });

    expect(markdown).toContain("# Issue Triage: Crash when loading config");
    expect(markdown).toContain("**Priority:** high");
    expect(markdown).toContain("- bug");
    expect(markdown).toContain("Thanks for the report.");
  });
});

describe("formatPullRequestReport", () => {
  test("renders pull request review guidance as markdown", () => {
    const markdown = formatPullRequestReport({
      title: "Add release command",
      riskLevel: "medium",
      riskAreas: ["command routing"],
      checklist: ["Verify help output."],
      testingNotes: ["Run unit tests."],
      mergeReadiness: "Review command behavior before merge."
    });

    expect(markdown).toContain("# PR Review: Add release command");
    expect(markdown).toContain("**Risk:** medium");
    expect(markdown).toContain("- command routing");
    expect(markdown).toContain("Verify help output.");
  });
});
