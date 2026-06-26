/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ConfigValidationError,
  CONFIG_KEYS,
  formatConfigValue,
  getConfigKey,
  isConfigKey,
  loadConfig,
  setConfigKey,
  type MiraConfigKey,
} from "@mira/shared";

import { logger, printTable } from "../ui/index.js";

function handleConfigError(err: unknown): void {
  if (err instanceof ConfigValidationError) {
    logger.error(err.message);
    process.exitCode = 1;
    return;
  }
  throw err;
}

export async function runConfigGet(key: string): Promise<void> {
  if (!isConfigKey(key)) {
    logger.error(`Unknown config key: ${key}`);
    process.exitCode = 1;
    return;
  }

  try {
    const config = await loadConfig();
    logger.raw(formatConfigValue(getConfigKey(config, key as MiraConfigKey)));
  } catch (err) {
    handleConfigError(err);
  }
}

export async function runConfigSet(key: string, value: string): Promise<void> {
  try {
    await setConfigKey(key, value);
    logger.success(`Set ${key}`);
  } catch (err) {
    handleConfigError(err);
  }
}

export async function runConfigList(): Promise<void> {
  try {
    const config = await loadConfig();
    const rows = CONFIG_KEYS.map((key: (typeof CONFIG_KEYS)[number]) => ({
      key,
      value: formatConfigValue(config[key]),
    }));
    printTable(rows, [
      { header: "Key", accessor: "key" },
      { header: "Value", accessor: "value" },
    ]);
  } catch (err) {
    handleConfigError(err);
  }
}
