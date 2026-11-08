import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  app: { setName: vi.fn(), setPath: vi.fn(), setAppUserModelId: vi.fn(), getPath: vi.fn() },
  mkdirSync: vi.fn(),
}));
vi.mock("node:fs", () => ({ mkdirSync: mocks.mkdirSync }));
vi.mock("electron", () => ({ app: mocks.app }));
vi.mock("@vortex/shared", () => ({
  FORK: { productName: "Fork Manager", dataDirectory: "ForkManager", appId: "org.example.fork" },
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("VORTEX_E2E", "");
  vi.stubEnv("ELECTRON_APPDATA", "");
  vi.stubEnv("ELECTRON_USERDATA", "");
  mocks.app.getPath.mockReturnValue(path.resolve("test-appdata"));
});

afterEach(() => vi.unstubAllEnvs());

describe("fork startup isolation", () => {
  it("selects the fork data path before other startup modules run", async () => {
    await import("./forkStartup");
    const expected = path.resolve("test-appdata", "ForkManager");
    expect(mocks.mkdirSync).toHaveBeenCalledWith(expected, { recursive: true });
    expect(mocks.app.setPath).toHaveBeenCalledWith("userData", expected);
    expect(mocks.app.setName).toHaveBeenCalledWith("Fork Manager");
    expect(mocks.app.getPath).toHaveBeenCalledWith("appData");
  });

  it("isolates development data from the packaged fork", async () => {
    vi.stubEnv("NODE_ENV", "development");
    await import("./forkStartup");
    expect(mocks.app.setPath).toHaveBeenCalledWith(
      "userData",
      path.resolve("test-appdata", "ForkManager_devel"),
    );
  });

  it("retains explicit E2E user-data isolation", async () => {
    const testData = path.resolve("fixture-userdata");
    const testAppData = path.resolve("fixture-appdata");
    vi.stubEnv("VORTEX_E2E", "1");
    vi.stubEnv("ELECTRON_USERDATA", testData);
    vi.stubEnv("ELECTRON_APPDATA", testAppData);
    await import("./forkStartup");
    expect(mocks.app.setPath).toHaveBeenCalledWith("appData", testAppData);
    expect(mocks.app.setPath).toHaveBeenCalledWith("userData", testData);
  });
});
