import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { stdin as processStdin } from "node:process";
import { Readable } from "node:stream";

export type SourceKind = "file" | "stdin" | "github";

export type SourceDocument = {
  kind: SourceKind;
  title: string;
  content: string;
  url?: string;
};

export type GitHubReference = {
  owner: string;
  repo: string;
  number: number;
  kind: "issue" | "pull";
};

type GitHubIssueResponse = {
  title?: string;
  body?: string | null;
  html_url?: string;
};

export function parseGitHubUrl(value: string): GitHubReference | null {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.hostname !== "github.com") {
    return null;
  }

  const [owner, repo, type, numberText] = url.pathname.split("/").filter(Boolean);
  if (!owner || !repo || !type || !numberText) {
    return null;
  }

  if (type !== "issues" && type !== "pull") {
    return null;
  }

  const number = Number(numberText);
  if (!Number.isInteger(number) || number < 1) {
    return null;
  }

  return {
    owner,
    repo,
    number,
    kind: type === "pull" ? "pull" : "issue"
  };
}

export async function readSource(source: string): Promise<SourceDocument> {
  if (source === "-") {
    const content = await readStream(processStdin);
    return {
      kind: "stdin",
      title: "stdin",
      content
    };
  }

  const githubReference = parseGitHubUrl(source);
  if (githubReference) {
    return fetchGitHubIssue(githubReference);
  }

  try {
    return {
      kind: "file",
      title: basename(source),
      content: await readFile(source, "utf8"),
      url: undefined
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not read source "${source}": ${message}`);
  }
}

export async function fetchGitHubIssue(reference: GitHubReference): Promise<SourceDocument> {
  const endpoint = `https://api.github.com/repos/${reference.owner}/${reference.repo}/issues/${reference.number}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "oss-maintainer-kit"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(endpoint, { headers });
  if (!response.ok) {
    throw new Error(
      `GitHub request failed for ${reference.owner}/${reference.repo}#${reference.number}: ${response.status} ${response.statusText}`
    );
  }

  const payload = (await response.json()) as GitHubIssueResponse;
  const title = payload.title ?? `${reference.repo}#${reference.number}`;
  const body = payload.body?.trim() || "No body provided.";

  return {
    kind: "github",
    title,
    content: `# ${title}\n\n${body}`,
    url: payload.html_url
  };
}

async function readStream(stream: Readable): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }

  return Buffer.concat(chunks).toString("utf8");
}

export function localFileStream(path: string): Readable {
  return createReadStream(path);
}
