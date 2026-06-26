/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { getAllThemes, setTheme, type ThemeName } from "./theme.js";
import { introPrompt, outroPrompt, promptSelect } from "./prompt.js";
import { printBanner } from "./banner.js";
import { logger } from "./logger.js";

const isTTY = Boolean(process.stdin.isTTY);

/**
 * Run the first-time setup flow. Pass a `saveTheme` callback to
 * persist the selection (wired to config package in a later issue).
 */
export async function runFirstRun(
  saveTheme: (theme: ThemeName) => Promise<void>
): Promise<void> {
  if (!isTTY) {
    logger.debug("Non-TTY environment detected. Skipping first-run onboarding configuration.");
    return;
  }

  printBanner({ force: true });
  introPrompt("Welcome to mira! Let's get you set up.");

  const theme = await promptSelect<ThemeName>({
    message: "Pick a color theme:",
    options: getAllThemes().map((t) => ({
      value: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
      hint: t === "mono" ? "accessibility friendly" : undefined,
    })),
    initialValue: "default",
  });

  logger.debug(`Applying selected terminal UI theme: ${theme}`);
  setTheme(theme);
  
  try {
    await saveTheme(theme);
    logger.debug("Successfully persisted theme options to configuration profile.");
  } catch (err) {
    logger.error("Failed to save theme choice to disk configuration:", err);
    throw err;
  }

  outroPrompt("You're all set. Run `mira --help` to get started.");
}