import * as core from "@actions/core";

async function run() {
  try {
    core.info("bazel-diff action starting...");
  } catch (error) {
    core.setFailed(error.Message);
  }
}

run();
