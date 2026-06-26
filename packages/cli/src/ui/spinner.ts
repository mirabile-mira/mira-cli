/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import ora, { type Ora } from "ora";
import { getTheme } from "./theme.js";

const isTTY = Boolean(process.stderr.isTTY);

export interface Spinner {
    start(text? : string): void;
    update(text? : string): void;
    succeed(text? : string): void;
    fail(text? : string): void;
    warn(text? : string): void;
    stop(): void;
}

export function createSpinner(initialText = ""): Spinner {
  if (!isTTY) {
    // Non-TTY: plain log fallback so CI output is readable
    return {
      start(text) { console.error(`… ${text ?? initialText}`); },
      update(text) { console.error(`… ${text}`); },
      succeed(text) { console.error(`✔ ${text ?? initialText}`); },
      fail(text) { console.error(`✖ ${text ?? initialText}`); },
      warn(text) { console.error(`⚠ ${text ?? initialText}`); },
      stop() {},
    };
  }
 
  const t = getTheme();
  const oraInstance: Ora = ora({
    text: initialText,
    color: "red",
    spinner: "dots",
    stream: process.stderr,
  });
 
  return {
    start(text) {
      oraInstance.start(text ?? initialText);
    },
    update(text) {
      oraInstance.text = text ?? oraInstance.text;
    },
    succeed(text) {
      oraInstance.succeed(t.success(text ?? oraInstance.text));
    },
    fail(text) {
      oraInstance.fail(t.error(text ?? oraInstance.text));
    },
    warn(text) {
      oraInstance.warn(t.warning(text ?? oraInstance.text));
    },
    stop() {
      oraInstance.stop();
    },
  };
}
 
export async function withSpinner<T>(
  text: string,
  task: (spinner: Spinner) => Promise<T>
): Promise<T> {
  const spinner = createSpinner(text);
  spinner.start();
  try {
    const result = await task(spinner);
    spinner.succeed();
    return result;
  } catch (err) {
    spinner.fail();
    throw err;
  }
}