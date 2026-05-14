import { jest } from "@jest/globals";

// Mock dependencies before importing the module under test
const mockExec = jest.fn();
const mockGetInput = jest.fn();
const mockInfo = jest.fn();
const mockSetFailed = jest.fn();
const mockDownloadTool = jest.fn();

jest.unstable_mockModule("@actions/exec", () => ({
  exec: mockExec,
}));

jest.unstable_mockModule("@actions/core", () => ({
  getInput: mockGetInput,
  info: mockInfo,
  setFailed: mockSetFailed,
}));

jest.unstable_mockModule("@actions/tool-cache", () => ({
  downloadTool: mockDownloadTool,
}));

const { verifyJava, downloadBazelDiff } = await import("./index.js");

describe("verifyJava", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("succeeds when java is available", async () => {
    mockExec.mockResolvedValue(0);
    await expect(verifyJava()).resolves.not.toThrow();
    expect(mockExec).toHaveBeenCalledWith("java", ["-version"]);
  });

  it("throws when java is not found", async () => {
    mockExec.mockRejectedValue(new Error("Unable to locate executable"));
    await expect(verifyJava()).rejects.toThrow(
      /Java is required but not found/,
    );
  });
});

describe("downloadBazelDiff", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses latest URL when version is latest", async () => {
    mockDownloadTool.mockResolvedValue("/tmp/bazel-diff.jar");
    const result = await downloadBazelDiff("latest");
    expect(mockDownloadTool).toHaveBeenCalledWith(
      "https://github.com/Tinder/bazel-diff/releases/latest/download/bazel-diff_deploy.jar",
    );
    expect(result).toBe("/tmp/bazel-diff.jar");
  });

  it("uses versioned URL when specific version is provided", async () => {
    mockDownloadTool.mockResolvedValue("/tmp/bazel-diff.jar");
    const result = await downloadBazelDiff("22.0.0");
    expect(mockDownloadTool).toHaveBeenCalledWith(
      "https://github.com/Tinder/bazel-diff/releases/download/22.0.0/bazel-diff_deploy.jar",
    );
    expect(result).toBe("/tmp/bazel-diff.jar");
  });
});
