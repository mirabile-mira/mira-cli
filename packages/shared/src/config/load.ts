/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "node:fs/promises";

import { configParseError, ConfigValidationError, formatZodError } from "./errors.js";
import { getConfigFilePath } from "./paths.js";
import { miraConfigSchema, type MiraConfig } from "./schema.js";

export async function loadConfig(): Promise<MiraConfig> {
  const configPath = getConfigFilePath();

  let raw: string;
  try {
    raw = await fs.readFile(configPath, "utf8");
  } catch (err) {
    if (isENOENT(err)) {
      return miraConfigSchema.parse({});
    }
    throw err;
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid JSON";
    throw configParseError(configPath, message);
  }

  const result = miraConfigSchema.safeParse(data);
  if (!result.success) {
    throw new ConfigValidationError(formatZodError(result.error, configPath));
  }

  return result.data;
}

function isENOENT(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as NodeJS.ErrnoException).code === "ENOENT"
  );
}
