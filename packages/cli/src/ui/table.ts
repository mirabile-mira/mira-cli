/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { getTheme } from "./theme.js";

const isTTY = Boolean(process.stdout.isTTY);

export interface TableColumn<T> {
  header: string;
  /** Key of row object, or a function returning the cell string. */
  accessor: keyof T | ((row: T) => string);
  /** Min column width. Defaults to header length. */
  minWidth?: number;
}

function getCell<T>(row: T, accessor: TableColumn<T>["accessor"]): string {
  if (typeof accessor === "function") return accessor(row);
  const value = row[accessor];
  return value == null ? "" : String(value);
}

/**
 * Render a typed array of objects as a formatted table.
 *
 * @example
 * printTable(plugins, [
 *   { header: "Name",    accessor: "name" },
 *   { header: "Version", accessor: "version" },
 *   { header: "Status",  accessor: (p) => p.enabled ? "on" : "off" },
 * ]);
 */
export function printTable<T extends object>(
  rows: T[],
  columns: TableColumn<T>[]
): void {
  if (rows.length === 0) {
    logger_raw("(no results)");
    return;
  }

  // Plain TSV in non-TTY
  if (!isTTY) {
    const headers = columns.map((c) => c.header).join("\t");
    console.log(headers);
    for (const row of rows) {
      console.log(columns.map((c) => getCell(row, c.accessor)).join("\t"));
    }
    return;
  }

  const t = getTheme();

  // Calculate column widths
  const widths = columns.map((col) => {
    const headerLen = col.header.length;
    const minWidth = col.minWidth ?? headerLen;
    const maxDataLen = rows.reduce((max, row) => {
      return Math.max(max, getCell(row, col.accessor).length);
    }, 0);
    return Math.max(minWidth, headerLen, maxDataLen);
  });

  const pad = (str: string, width: number) => str.padEnd(width);
  const separator = widths.map((w) => "─".repeat(w + 2)).join("┼");

  // Header row
  const headerRow = columns
    .map((col, i) => ` ${t.bold(t.primary(pad(col.header, widths[i]!)))} `)
    .join("│");

  console.log(`┌${widths.map((w) => "─".repeat(w + 2)).join("┬")}┐`);
  console.log(`│${headerRow}│`);
  console.log(`├${separator}┤`);

  // Data rows
  for (const row of rows) {
    const dataRow = columns
      .map((col, i) => ` ${pad(getCell(row, col.accessor), widths[i]!)} `)
      .join("│");
    console.log(`│${dataRow}│`);
  }

  console.log(`└${widths.map((w) => "─".repeat(w + 2)).join("┴")}┘`);
}

function logger_raw(msg: string) {
  console.log(msg);
}