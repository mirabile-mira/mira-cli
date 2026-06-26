/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import path from "node:path";

import dotenv from "dotenv";

/**
 * Load `.env` from the current working directory into `process.env`.
 *
 * Note: `MIRA_*` environment variables do not override `~/.mira/config.json`
 * values yet. That behavior is deferred to a future issue.
 */
export function loadEnvFromCwd(): void {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
    override: true,
    quiet: true,
  });
}
