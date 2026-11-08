// Run before Application/cli imports so startup.json and database paths are isolated too.
import { mkdirSync } from "node:fs";
import path from "node:path";

import { FORK } from "@vortex/shared";
import { app } from "electron";

app.setName(FORK.productName);
if (process.env.VORTEX_E2E === "1" && process.env.ELECTRON_APPDATA) {
  app.setPath("appData", process.env.ELECTRON_APPDATA);
}
const suffix = process.env.NODE_ENV === "development" ? "_devel" : "";
const userData =
  process.env.VORTEX_E2E === "1" && process.env.ELECTRON_USERDATA
    ? process.env.ELECTRON_USERDATA
    : path.join(app.getPath("appData"), FORK.dataDirectory + suffix);
mkdirSync(userData, { recursive: true });
app.setPath("userData", userData);
if (process.platform === "win32") app.setAppUserModelId(FORK.appId);
