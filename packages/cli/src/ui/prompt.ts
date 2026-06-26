/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as clack from "@clack/prompts";
import { getTheme } from "./theme.js";

const isTTY = Boolean(process.stdin.isTTY);

export class NonInteractiveError extends Error {
  constructor(field: string) {
    super(
      `Cannot prompt for '${field}' in a non-interactive environment. ` +
        `Pass it as a flag instead.`
    );
    this.name = "NonInteractiveError";
  }
}

function assertTTY(field: string): void {
  if (!isTTY) throw new NonInteractiveError(field);
}

function handleCancel(value: unknown, field: string): void {
  if (clack.isCancel(value)) {
    clack.cancel(`Cancelled at '${field}'.`);
    process.exit(0);
  }
}

/**
 * Prompt for a text value.
 */
export async function promptText(opts: {
  message: string;
  placeholder?: string;
  defaultValue?: string;
  validate?: (value: string) => string | undefined;
}): Promise<string> {
  assertTTY(opts.message);

  const value = await clack.text({
    message: opts.message,
    placeholder: opts.placeholder,
    defaultValue: opts.defaultValue,
    validate: opts.validate ? (v) => opts.validate!(v ?? "") : undefined,
  });

  handleCancel(value, opts.message);
  return value as string;
}

/**
 * Prompt for a password (masked input).
 */
export async function promptPassword(opts: {
  message: string;
  validate?: (value: string) => string | undefined;
}): Promise<string> {
  assertTTY(opts.message);

  const value = await clack.password({
    message: opts.message,
    validate: opts.validate ? (v) => opts.validate!(v ?? "") : undefined,
  });

  handleCancel(value, opts.message);
  return value as string;
}

/**
 * Confirm yes/no.
 */
export async function promptConfirm(opts: {
  message: string;
  initialValue?: boolean;
}): Promise<boolean> {
  assertTTY(opts.message);

  const value = await clack.confirm({
    message: opts.message,
    initialValue: opts.initialValue ?? false,
  });

  handleCancel(value, opts.message);
  return value as boolean;
}

/**
 * Select from a list of options.
 */
export async function promptSelect<T extends string>(opts: {
  message: string;
  options: { value: T; label: string; hint?: string }[];
  initialValue?: T;
}): Promise<T> {
  assertTTY(opts.message);

  const value = await clack.select({
    message: opts.message,
    options: opts.options as unknown as { value: string; label: string; hint?: string }[],
    initialValue: opts.initialValue,
  });

  handleCancel(value, opts.message);
  return value as T;
}

/**
 * Multi-select checkboxes.
 */
export async function promptMultiSelect<T extends string>(opts: {
  message: string;
  options: { value: T; label: string; hint?: string }[];
  required?: boolean;
}): Promise<T[]> {
  assertTTY(opts.message);

  const value = await clack.multiselect({
    message: opts.message,
    options: opts.options as unknown as { value: string; label: string; hint?: string }[],
    required: opts.required ?? false,
  });

  handleCancel(value, opts.message);
  return value as T[];
}

/** Call once at the start of an interactive flow. */
export function introPrompt(message: string): void {
  if (!isTTY) return;
  clack.intro(getTheme().primary(message));
}

/** Call once at the end of an interactive flow. */
export function outroPrompt(message: string): void {
  if (!isTTY) return;
  clack.outro(getTheme().success(message));
}