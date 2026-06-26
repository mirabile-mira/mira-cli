/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { getTheme } from "./theme.js";

const isTTY = Boolean(process.stdout.isTTY);

export interface StreamRenderer {
  /** Write the next chunk from the AI stream. */
  write(chunk: string): void;
  /** Call when the stream is complete. Ensures a trailing newline. */
  end(): void;
  /** Reset internal buffer (e.g. between turns). */
  reset(): void;
}

/**
 * Creates a stream renderer for AI output.
 *
 * @example
 * const renderer = createStreamRenderer();
 * for await (const chunk of aiStream) {
 *   renderer.write(chunk);
 * }
 * renderer.end();
 */
export function createStreamRenderer(opts: { color?: boolean } = {}): StreamRenderer {
  const useColor = opts.color !== false && isTTY;
  const t = getTheme();
  let buffer = "";
  let started = false;

  if (!isTTY) {
    // Non-TTY: buffer lines and flush complete ones
    return {
      write(chunk: string) {
        buffer += chunk;
        const lines = buffer.split("\n");
        // Flush all complete lines, keep the last partial
        for (let i = 0; i < lines.length - 1; i++) {
          console.log(lines[i]);
        }
        buffer = lines[lines.length - 1] ?? "";
      },
      end() {
        if (buffer.length > 0) {
          console.log(buffer);
          buffer = "";
        }
      },
      reset() {
        buffer = "";
      },
    };
  }

  return {
    write(chunk: string) {
      if (!started) {
        started = true;
        // Small visual cue that streaming has begun
        process.stdout.write(useColor ? t.muted("") : "");
      }
      process.stdout.write(useColor ? t.primary(chunk) : chunk);
      buffer += chunk;
    },
    end() {
      if (started) {
        // Ensure we always end on a new line
        if (!buffer.endsWith("\n")) process.stdout.write("\n");
      }
      buffer = "";
      started = false;
    },
    reset() {
      buffer = "";
      started = false;
    },
  };
}

/**
 * Convenience: pipe an async iterable of string chunks to the renderer.
 *
 * @example
 * await renderStream(response.body);
 */
export async function renderStream(
  iterable: AsyncIterable<string>,
  opts?: { color?: boolean }
): Promise<void> {
  const renderer = createStreamRenderer(opts);
  for await (const chunk of iterable) {
    renderer.write(chunk);
  }
  renderer.end();
}