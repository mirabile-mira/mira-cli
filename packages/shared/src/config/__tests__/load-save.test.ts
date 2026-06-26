/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ConfigValidationError } from "../errors.js";
import { loadConfig } from "../load.js";
import { saveConfig, setConfigKey } from "../save.js";

let tempDir = "";
let configPath = "";

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "mira-config-"));
  configPath = path.join(tempDir, "config.json");
  process.env["MIRA_CONFIG_PATH"] = configPath;
});

afterEach(async () => {
  delete process.env["MIRA_CONFIG_PATH"];
  await fs.rm(tempDir, { recursive: true, force: true });
});

describe("loadConfig", () => {
  it("returns defaults when config file is missing", async () => {
    const config = await loadConfig();
    expect(config.configVersion).toBe(1);
    expect(config.model).toBe("claude-sonnet-4.6");
  });

  it("throws on invalid JSON", async () => {
    await fs.writeFile(configPath, "{ not-json", "utf8");
    await expect(loadConfig()).rejects.toBeInstanceOf(ConfigValidationError);
  });
});

describe("saveConfig", () => {
  it("writes config with restricted permissions when supported", async () => {
    const config = await loadConfig();
    await saveConfig(config);

    const mode = (await fs.stat(configPath)).mode & 0o777;
    if (process.platform !== "win32") {
      expect(mode).toBe(0o600);
    } else {
      expect(mode).toBeGreaterThan(0);
    }
  });
});

describe("setConfigKey", () => {
  it("coerces JSON for complex keys", async () => {
    await setConfigKey(
      "mcpServers",
      '[{"type":"stdio","name":"test","command":"node"}]',
    );
    await setConfigKey("sandbox", '[{"name":"test","image":"node:20"}]');
    await setConfigKey("skills", '[{"name":"test-skill","enabled":true}]');
    await setConfigKey("plugins", '[{"name":"test-plugin","enabled":false}]');
    await setConfigKey("setting", '{"editor":"vim"}');

    const config = await loadConfig();
    expect(config.mcpServers).toHaveLength(1);
    expect(config.sandbox[0]?.image).toBe("node:20");
    expect(config.skills[0]?.name).toBe("test-skill");
    expect(config.plugins[0]?.enabled).toBe(false);
    expect(config.setting).toEqual({ editor: "vim" });
  });

  it("rejects invalid JSON for complex keys", async () => {
    await expect(setConfigKey("skills", "not-json")).rejects.toBeInstanceOf(
      ConfigValidationError,
    );
  });
});
