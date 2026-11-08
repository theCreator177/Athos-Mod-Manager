import { describe, it, expect } from "vitest";

import automationReducer from "./automation";

describe("Athos automation defaults", () => {
  it("starts with installation, enabling and deployment disabled", () => {
    expect(automationReducer.defaults).toEqual({
      deploy: false,
      install: false,
      enable: false,
      start: false,
      minimized: false,
    });
  });

  it.each([
    ["SET_AUTO_DEPLOYMENT", "deploy"],
    ["SET_AUTO_INSTALL", "install"],
    ["SET_AUTO_ENABLE", "enable"],
  ] as const)("preserves explicit opt-in and opt-out through %s", (action, setting) => {
    const initial = { ...automationReducer.defaults };
    const enabled = automationReducer.reducers[action](initial, true);
    const disabled = automationReducer.reducers[action](enabled, false);

    expect(enabled[setting]).toBe(true);
    expect(disabled[setting]).toBe(false);
    expect(initial[setting]).toBe(false);
  });

  it("preserves existing manual choices when another setting changes", () => {
    const existing = { deploy: true, install: true, enable: true, start: false, minimized: false };
    const result = automationReducer.reducers.SET_AUTO_START(existing, true);

    expect(result).toEqual({ ...existing, start: true });
  });
});

describe("setAutoDeployment", () => {
  it("sets Auto Deployment", () => {
    const input = {
      deploy: false,
      install: false,
      enable: false,
      start: false,
      minimized: false,
    };
    const result = automationReducer.reducers.SET_AUTO_DEPLOYMENT(input, true);
    expect(result).toEqual({
      deploy: true,
      install: false,
      enable: false,
      start: false,
      minimized: false,
    });
  });
});
