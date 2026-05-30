export type AnalysisInput = {
  title: string;
  content: string;
};

export type IssueAnalysis = {
  title: string;
  priority: "low" | "medium" | "high";
  labels: string[];
  summary: string;
  nextActions: string[];
  responseDraft: string;
};

export type PullRequestAnalysis = {
  title: string;
  riskLevel: "low" | "medium" | "high";
  riskAreas: string[];
  checklist: string[];
  testingNotes: string[];
  mergeReadiness: string;
};

export type ReleaseAnalysis = {
  title: string;
  highlights: string[];
  fixes: string[];
  improvements: string[];
  notes: string[];
};

export type WeeklyAnalysis = {
  title: string;
  sources: string[];
  completed: string[];
  needsAttention: string[];
  focusNextWeek: string[];
};

export function analyzeIssue(input: AnalysisInput): IssueAnalysis {
  const text = normalize(`${input.title}\n${input.content}`);
  const labels = new Set<string>();

  if (containsAny(text, ["crash", "error", "exception", "bug", "fail", "broken"])) {
    labels.add("bug");
  }
  if (containsAny(text, ["regression", "regressed"])) {
    labels.add("regression");
  }
  if (containsAny(text, ["security", "vulnerability", "cve", "token leak", "secret"])) {
    labels.add("security");
  }
  if (containsAny(text, ["docs", "documentation", "readme"])) {
    labels.add("documentation");
  }
  if (labels.has("bug") || labels.has("regression")) {
    labels.add("needs-reproduction");
  }
  if (labels.size === 0) {
    labels.add("needs-triage");
  }

  const priority = determineIssuePriority(text);

  return {
    title: input.title,
    priority,
    labels: [...labels],
    summary: firstSentence(input.content),
    nextActions: issueNextActions(labels, priority),
    responseDraft:
      "Thanks for the report. Could you share the smallest reproduction, the version you are using, and the expected versus actual behavior?"
  };
}

export function analyzePullRequest(input: AnalysisInput): PullRequestAnalysis {
  const text = normalize(`${input.title}\n${input.content}`);
  const riskAreas = new Set<string>();

  if (containsAny(text, ["command", "cli", "routing", "parser"])) {
    riskAreas.add("command routing");
  }
  if (containsAny(text, ["file", "filesystem", "fs", "io", "read", "write"])) {
    riskAreas.add("file IO");
  }
  if (containsAny(text, ["auth", "token", "permission", "security"])) {
    riskAreas.add("security");
  }
  if (containsAny(text, ["api", "network", "fetch", "http"])) {
    riskAreas.add("network API");
  }

  const riskLevel = riskAreas.has("security") || riskAreas.has("network API")
    ? "high"
    : riskAreas.size > 0
      ? "medium"
      : "low";

  return {
    title: input.title,
    riskLevel,
    riskAreas: riskAreas.size > 0 ? [...riskAreas] : ["localized change"],
    checklist: [
      "Confirm the change matches the issue or maintainer goal.",
      "Review user-facing output and error messages.",
      "Check whether tests cover the main success path and a failure path."
    ],
    testingNotes: containsAny(text, ["test", "testing", "spec"])
      ? ["The PR mentions tests; verify they run in CI and cover the risky paths."]
      : ["Ask for a test plan or add coverage before merge."],
    mergeReadiness:
      riskLevel === "low"
        ? "Ready after one maintainer review and passing CI."
        : "Review risky paths carefully, confirm tests, and require passing CI before merge."
  };
}

export function analyzeRelease(input: AnalysisInput): ReleaseAnalysis {
  const bullets = extractBullets(input.content);

  return {
    title: input.title,
    highlights: bullets.filter((item) => /^add(ed)?\b/i.test(item)).map(stripReleaseVerb),
    fixes: bullets.filter((item) => /^fix(ed)?\b/i.test(item)).map(stripReleaseVerb),
    improvements: bullets.filter((item) => /^improv(ed|ement)?\b/i.test(item)).map(stripReleaseVerb),
    notes: bullets.filter((item) => !/^(add(ed)?|fix(ed)?|improv(ed|ement)?)\b/i.test(item))
  };
}

export function analyzeWeekly(inputs: AnalysisInput[]): WeeklyAnalysis {
  const bullets = inputs.flatMap((input) => extractBullets(input.content));
  const completed = bullets.filter((item) => /^(fixed|reviewed|merged|released|triaged|added)\b/i.test(item));
  const needsAttention = bullets.filter((item) => /(blocked|failing|needs|regression|security|urgent)/i.test(item));

  return {
    title: "Weekly Maintainer Report",
    sources: inputs.map((input) => input.title),
    completed: completed.length > 0 ? completed : bullets.slice(0, 5),
    needsAttention: needsAttention.length > 0 ? needsAttention : ["No urgent blockers found in the provided notes."],
    focusNextWeek: ["Follow up on open reviews and unresolved triage items."]
  };
}

function determineIssuePriority(text: string): IssueAnalysis["priority"] {
  if (containsAny(text, ["security", "vulnerability", "cve", "crash", "blocks", "regression"])) {
    return "high";
  }
  if (containsAny(text, ["bug", "error", "broken", "fail"])) {
    return "medium";
  }
  return "low";
}

function issueNextActions(labels: Set<string>, priority: IssueAnalysis["priority"]): string[] {
  const actions = ["Ask for a minimal reproduction and environment details."];

  if (labels.has("security")) {
    actions.unshift("Move sensitive details to the private security reporting process.");
  }
  if (priority === "high") {
    actions.push("Confirm whether the latest release is affected and whether a patch release is needed.");
  }

  return actions;
}

function normalize(value: string): string {
  return value.toLowerCase();
}

function containsAny(value: string, terms: string[]): boolean {
  return terms.some((term) => value.includes(term));
}

function firstSentence(value: string): string {
  const text = value.replace(/\s+/g, " ").trim();
  const match = text.match(/^(.+?[.!?])(\s|$)/);
  return match?.[1] ?? text.slice(0, 180);
}

function extractBullets(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);
}

function stripReleaseVerb(value: string): string {
  return value.replace(/^(added|add|fixed|fix|improved|improve|improvement)\s+/i, "").trim();
}
