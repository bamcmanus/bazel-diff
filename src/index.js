import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import { readFile } from "fs/promises";

export async function verifyJava() {
  try {
    await exec.exec("java", ["-version"]);
  } catch (error) {
    throw new Error(
      `Java is required but not found on the runner. Add actions/setup-java to your workflow. ${error.message}`,
    );
  }
}

export async function downloadBazelDiff(version) {
  const url =
    version === "latest"
      ? "https://github.com/Tinder/bazel-diff/releases/latest/download/bazel-diff_deploy.jar"
      : `https://github.com/Tinder/bazel-diff/releases/download/${version}/bazel-diff_deploy.jar`;

  core.info(`Downloading bazel-diff from ${url}`);
  const jarPath = await tc.downloadTool(url);
  return jarPath;
}

export async function resolveBaseRef() {
  let baseRef = core.getInput("base-ref");
  if (baseRef !== "") {
    return baseRef;
  }
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath) {
    const event = process.env.GITHUB_EVENT_NAME;
    return parseGitHubEvent(eventPath, event);
  }
  return "HEAD~1";
}

export async function parseGitHubEvent(filePath, eventType) {
  const event = JSON.parse(await readFile(filePath, "utf8"));
  if (eventType === "pull_request") {
    return event.pull_request.base.sha;
  }
  if (eventType === "push") {
    return event.before;
  }
  if (eventType === "merge_group") {
    return event.merge_group.base_sha;
  }
  throw new Error(`unsupported event type: ${eventType}`);
}

export async function run() {
  try {
    core.info("bazel-diff action starting...");
    await verifyJava();

    const version = core.getInput("bazel-diff-version");
    const jarPath = await downloadBazelDiff(version);
    core.info(`bazel-diff downloaded to ${jarPath}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
