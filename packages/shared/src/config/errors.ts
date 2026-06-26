/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ZodError } from "zod";

export class ConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigValidationError";
  }
}

function formatIssuePath(path: ReadonlyArray<PropertyKey>): string {
  if (path.length === 0) {
    return "(root)";
  }
  return path.map((segment) => String(segment)).join(".");
}

export function formatZodError(error: ZodError, configPath: string): string {
  const lines = error.issues.map(
    (issue) => `  ${formatIssuePath(issue.path)}: ${issue.message}`,
  );
  return `Invalid config at ${configPath}:\n${lines.join("\n")}`;
}

export function configParseError(configPath: string, message: string): ConfigValidationError {
  return new ConfigValidationError(`Invalid config at ${configPath}: ${message}`);
}
