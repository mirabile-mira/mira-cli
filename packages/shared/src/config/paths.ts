/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const CONFIG_PATH_ENV = "MIRA_CONFIG_PATH";

export function getMiraHomeDir(): string {
  return path.join(os.homedir(), ".mira");
}

export function getConfigFilePath(): string {
  const override = process.env[CONFIG_PATH_ENV];
  if (override) {
    return path.resolve(override);
  }
  return path.join(getMiraHomeDir(), "config.json");
}

export async function ensureMiraHomeDir(): Promise<void> {
  const configPath = getConfigFilePath();
  await fs.mkdir(path.dirname(configPath), { recursive: true });
}
