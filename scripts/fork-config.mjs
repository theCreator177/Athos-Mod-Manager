const reservedName = /^(?:con|prn|aux|nul|com[0-9]|lpt[0-9]|vortex|vortex_devel)$/i;
const component = /^[A-Za-z][A-Za-z0-9_-]{1,63}$/;
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*)?$/;

/** @returns {{ok: boolean, errors: string[]}} */
export function validateForkConfig(config) {
  const errors = [];
  if (!config || typeof config !== "object")
    return { ok: false, errors: ["Expected a config object"] };
  for (const key of ["dataDirectory", "executableName", "packageName"]) {
    if (
      typeof config[key] !== "string" ||
      !component.test(config[key]) ||
      reservedName.test(config[key])
    ) {
      errors.push(`${key} must be an isolated, non-reserved filename component`);
    }
  }
  if (
    typeof config.appId !== "string" ||
    !/^[a-z][a-z0-9]*(?:\.[a-z][a-z0-9]*){2,}$/.test(config.appId) ||
    config.appId.startsWith("com.nexusmods.")
  )
    errors.push("Use a distinct reverse-domain appId");
  if (
    typeof config.productName !== "string" ||
    !/^[A-Za-z0-9][A-Za-z0-9 ._-]{1,62}[A-Za-z0-9]$/.test(config.productName) ||
    config.productName.toLowerCase() === "vortex"
  )
    errors.push("Invalid productName");
  for (const key of ["maintainer", "description"]) {
    if (typeof config[key] !== "string" || !config[key].trim() || /[\r\n<>]/.test(config[key]))
      errors.push(`Invalid ${key}`);
  }
  if (typeof config.version !== "string" || !semver.test(config.version))
    errors.push("Use a semantic version");
  if (typeof config.registerProtocolClients !== "boolean")
    errors.push("registerProtocolClients must be boolean");
  const automation = config.automation;
  if (!automation || typeof automation !== "object" || Array.isArray(automation)) {
    errors.push("Missing automation policy");
  } else {
    for (const key of ["deploy", "install", "enable"]) {
      if (typeof automation[key] !== "boolean") errors.push(`automation.${key} must be boolean`);
    }
  }
  errors.push(...validateUpdates(config.updates));
  return { ok: errors.length === 0, errors };
}

/** @returns {string[]} */
function validateUpdates(updates) {
  if (!updates || typeof updates !== "object") return ["Missing updates policy"];
  const errors = [];
  if (typeof updates.enabled !== "boolean") errors.push("updates.enabled must be boolean");
  for (const key of ["owner", "repository"]) {
    if (typeof updates[key] !== "string" || !/^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(updates[key]))
      errors.push(`Invalid updates.${key}`);
  }
  if (`${updates.owner}/${updates.repository}`.toLowerCase() === "nexus-mods/vortex")
    errors.push("Use the fork's release repository");
  const publishers = updates.publisherNames;
  if (
    !Array.isArray(publishers) ||
    publishers.some((name) => typeof name !== "string" || !name.trim())
  ) {
    errors.push("publisherNames must be an array of nonempty certificate names");
  } else if (updates.enabled && publishers.length === 0) {
    errors.push(
      "Enable automatic updates only after configuring your signing certificate identity",
    );
  }
  return errors;
}

/** @returns {object} */
export function makeBuilderConfig(original, config) {
  const result = structuredClone(original);
  result.appId = config.appId;
  result.productName = config.productName;
  result.copyright = `Vortex contributors; fork modifications copyright 2026 ${config.maintainer}`;
  result.win.executableName = config.executableName;
  result.win.publish = [
    {
      provider: "github",
      owner: config.updates.owner,
      repo: config.updates.repository,
      private: false,
    },
  ];
  delete result.win.publisherName;
  if (config.updates.publisherNames.length > 0)
    result.win.publisherName = config.updates.publisherNames;
  result.win.verifyUpdateCodeSignature = true;
  result.nsis.artifactName = `${config.packageName}-setup-\${version}.\${ext}`;
  result.nsis.deleteAppDataOnUninstall = false;
  result.linux.description = config.description;
  result.linux.maintainer = config.maintainer;
  result.linux.mimeTypes = [];
  return result;
}
