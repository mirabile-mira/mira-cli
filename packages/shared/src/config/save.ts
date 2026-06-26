/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "node:fs/promises";

import { ConfigValidationError, formatZodError } from "./errors.js";
import { loadConfig } from "./load.js";
import { ensureMiraHomeDir, getConfigFilePath } from "./paths.js";
import {
  isConfigKey,
  isJsonValueKey,
  miraConfigSchema,
  type MiraConfig,
  type MiraConfigKey,
} from "./schema.js";

const CONFIG_FILE_MODE = 0o600;

export function getConfigKey(config: MiraConfig, key: MiraConfigKey): unknown {
  return config[key];
}

export async function saveConfig(config: MiraConfig): Promise<void> {
  const result = miraConfigSchema.safeParse(config);
  if (!result.success) {
    throw new ConfigValidationError(formatZodError(result.error, getConfigFilePath()));
  }

  await ensureMiraHomeDir();
  const configPath = getConfigFilePath();
  const tmpPath = `${configPath}.tmp`;

  await fs.writeFile(tmpPath, `${JSON.stringify(result.data, null, 2)}\n`, "utf8");

  try {
    await fs.chmod(tmpPath, CONFIG_FILE_MODE);
  } catch {
    // chmod is best-effort; Windows may not support Unix permission bits.
  }

  await fs.rename(tmpPath, configPath);

  try {
    await fs.chmod(configPath, CONFIG_FILE_MODE);
  } catch {
    // chmod is best-effort; Windows may not support Unix permission bits.
  }
}

export async function setConfigKey(
  key: string,
  rawValue: string,
): Promise<MiraConfig> {
  if (!isConfigKey(key)) {
    throw new ConfigValidationError(`Unknown config key: ${key}`);
  }

  const coerced = coerceConfigValue(key, rawValue);
  const current = await loadConfig();
  const merged = { ...current, [key]: coerced };

  const result = miraConfigSchema.safeParse(merged);
  if (!result.success) {
    throw new ConfigValidationError(formatZodError(result.error, getConfigFilePath()));
  }

  await saveConfig(result.data);
  return result.data;
}

function coerceConfigValue(key: MiraConfigKey, rawValue: string): unknown {
  if (key === "configVersion") {
    const parsed = Number(rawValue);
    if (!Number.isInteger(parsed)) {
      throw new ConfigValidationError(
        `Invalid value for ${key}: expected integer 1`,
      );
    }
    return parsed;
  }

  if (isJsonValueKey(key)) {
    try {
      return JSON.parse(rawValue);
    } catch {
      throw new ConfigValidationError(
        `Invalid value for ${key}: expected JSON array or object`,
      );
    }
  }

  return rawValue;
}

export function formatConfigValue(value: unknown): string {
  if (value === undefined) {
    return "";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}
