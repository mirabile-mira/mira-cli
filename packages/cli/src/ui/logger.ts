/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import chalk from "chalk";
import { getTheme } from "./theme.js";

const isTTY = Boolean(process.stdout.isTTY);

function prefix(symbol: string, colorFn: chalk.Chalk): string {
    return isTTY ? colorFn(symbol) : symbol;
}

export const logger = {
  info(message: string): void {
    const t = getTheme();
    console.log(`${prefix("ℹ", t.primary)} ${message}`);
  },
 
  success(message: string): void {
    const t = getTheme();
    console.log(`${prefix("✔", t.success)} ${message}`);
  },
 
  warn(message: string): void {
    const t = getTheme();
    console.warn(`${prefix("⚠", t.warning)} ${message}`);
  },
 
  error(message: string, err?: unknown): void {
    const t = getTheme();
    console.error(`${prefix("✖", t.error)} ${message}`);
    if (err instanceof Error && err.message) {
      console.error(`${t.muted(err.message)}`);
    }
  },

  debug(message: string): void {
    if (process.env["DEBUG"] !== "true" && process.env["MIRA_DEBUG"] !== "true") return;
    const t = getTheme();
    console.log(`${prefix("◆", t.muted)} ${t.muted(message)}`);
  },

  br(): void {
    console.log();
  },

  raw(message: string): void {
    console.log(message);
  },
};