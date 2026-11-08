import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import { makeBuilderConfig, validateForkConfig } from "./fork-config.mjs";

const root = new URL("../", import.meta.url);
const readJson = async (file) => JSON.parse(await readFile(new URL(file, root), "utf8"));
const config = await readJson("fork.config.json");
const builder = await readJson("src/main/electron-builder.config.json");
const workspace = await readJson("package.json");

test("default fork is isolated, locally maintained, and has updates disabled", () => {
  assert.equal(validateForkConfig(config).ok, true);
  assert.notEqual(config.dataDirectory.toLowerCase(), "vortex");
  assert.equal(config.updates.enabled, false);
  assert.equal(config.registerProtocolClients, false);
  assert.deepEqual(config.automation, { deploy: false, install: false, enable: false });
  assert.equal(workspace.author, config.maintainer);
  assert.equal(workspace.license, "GPL-3.0-only");
  assert.ok(
    workspace.contributors.includes("Black Tree Gaming Ltd. and Vortex contributors (upstream)"),
  );
});

test("rejects traversal, reserved paths, and original app identity", () => {
  for (const value of ["../Vortex", "Vortex", "vortex_devel", "CON", "aux", "TMM/child", "TMM."]) {
    assert.equal(validateForkConfig({ ...config, dataDirectory: value }).ok, false, value);
  }
  assert.equal(validateForkConfig({ ...config, appId: "com.nexusmods.vortex" }).ok, false);
});

test("rejects invalid metadata and incomplete update policy", () => {
  for (const change of [
    { version: "latest" },
    { productName: "bad/name" },
    { maintainer: "" },
    { registerProtocolClients: "false" },
    { updates: null },
  ]) {
    assert.equal(validateForkConfig({ ...config, ...change }).ok, false);
  }
  assert.equal(
    validateForkConfig({ ...config, updates: { ...config.updates, enabled: true } }).ok,
    false,
  );
});

test("enabled updates require a fork repository and an explicit publisher identity", () => {
  const updates = { enabled: true, owner: "Tony", repository: "Manager", publisherNames: ["Tony"] };
  assert.equal(validateForkConfig({ ...config, updates }).ok, true);
  assert.equal(
    validateForkConfig({
      ...config,
      updates: { ...updates, owner: "Nexus-Mods", repository: "Vortex" },
    }).ok,
    false,
  );
});

test("builder keeps dependency layout while isolating app and installer identity", () => {
  const result = makeBuilderConfig(builder, config);
  assert.equal(result.appId, config.appId);
  assert.equal(result.productName, config.productName);
  assert.equal(result.win.executableName, config.executableName);
  assert.equal(result.nsis.artifactName, `${config.packageName}-setup-\${version}.\${ext}`);
  assert.equal(result.win.publish[0].owner, config.updates.owner);
  assert.equal(result.win.publisherName, undefined);
  assert.deepEqual(result.asarUnpack, builder.asarUnpack);
  assert.equal(result.win.verifyUpdateCodeSignature, true);
  assert.equal(result.nsis.deleteAppDataOnUninstall, false);
});

test("rejects incomplete or non-boolean automation policies", () => {
  for (const automation of [null, {}, { deploy: "false", install: false, enable: false }]) {
    assert.equal(validateForkConfig({ ...config, automation }).ok, false);
  }
});
