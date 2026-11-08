import { FORK } from "@vortex/shared";
import { afterEach, expect, it, vi } from "vitest";

import { repoForChannel, repoOwner } from "./autoupdater/releaseResolver";
import { isUpdaterActive } from "./updater";

vi.mock("../logging", () => ({ log: vi.fn() }));
vi.mock("./autoupdater", () => ({ setupAutoUpdater: vi.fn() }));
afterEach(() => vi.unstubAllEnvs());

it("uses the configured fork release repository, not the upstream repository", () => {
  vi.stubEnv("VORTEX_UPDATER_REPO", "");
  expect(repoOwner()).toBe(FORK.updates.owner);
  expect(repoForChannel()).toBe(FORK.updates.repository);
  expect(`${repoOwner()}/${repoForChannel()}`).not.toBe("Nexus-Mods/Vortex");
});

it("ships with updates and protocol registration disabled", () => {
  vi.stubEnv("NODE_ENV", "production");
  expect(FORK.updates.enabled).toBe(false);
  expect(FORK.registerProtocolClients).toBe(false);
  expect(isUpdaterActive("regular")).toBe(false);
});
