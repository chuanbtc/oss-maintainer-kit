import type { IssueAnalysis, PullRequestAnalysis, ReleaseAnalysis, WeeklyAnalysis } from "./analyzers.js";

export function formatIssueReport(report: IssueAnalysis): string {
  return [
    `# Issue Triage: ${report.title}`,
    "",
    `**Priority:** ${report.priority}`,
    "",
    "## Summary",
    "",
    report.summary,
    "",
    "## Suggested Labels",
    "",
    list(report.labels),
    "",
    "## Next Actions",
    "",
    list(report.nextActions),
    "",
    "## Maintainer Response Draft",
    "",
    report.responseDraft
  ].join("\n");
}

export function formatPullRequestReport(report: PullRequestAnalysis): string {
  return [
    `# PR Review: ${report.title}`,
    "",
    `**Risk:** ${report.riskLevel}`,
    "",
    "## Risk Areas",
    "",
    list(report.riskAreas),
    "",
    "## Review Checklist",
    "",
    list(report.checklist),
    "",
    "## Testing Notes",
    "",
    list(report.testingNotes),
    "",
    "## Merge Readiness",
    "",
    report.mergeReadiness
  ].join("\n");
}

export function formatReleaseReport(report: ReleaseAnalysis): string {
  return [
    "# Release Notes Draft",
    "",
    `Source: ${report.title}`,
    "",
    "## Highlights",
    "",
    listOrFallback(report.highlights, "No feature highlights detected."),
    "",
    "## Fixes",
    "",
    listOrFallback(report.fixes, "No fixes detected."),
    "",
    "## Improvements",
    "",
    listOrFallback(report.improvements, "No improvements detected."),
    "",
    "## Other Notes",
    "",
    listOrFallback(report.notes, "No additional notes detected.")
  ].join("\n");
}

export function formatWeeklyReport(report: WeeklyAnalysis): string {
  return [
    "# Weekly Maintainer Report",
    "",
    "## Sources",
    "",
    list(report.sources),
    "",
    "## Completed",
    "",
    listOrFallback(report.completed, "No completed work detected."),
    "",
    "## Needs Attention",
    "",
    listOrFallback(report.needsAttention, "No urgent blockers found."),
    "",
    "## Focus Next Week",
    "",
    list(report.focusNextWeek)
  ].join("\n");
}

function list(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function listOrFallback(items: string[], fallback: string): string {
  return items.length > 0 ? list(items) : `- ${fallback}`;
}
