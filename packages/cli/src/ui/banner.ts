/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import figlet from "figlet";
import gradient from "gradient-string";
import chalk from "chalk";
import { getTheme } from "./theme.js";

type Theme = ReturnType<typeof getTheme>;

const isTTY = Boolean(process.stdout.isTTY);

export interface BannerOptions {
  version?: string;
  subtitle?: string;
  model?: string;
  mcpServer?: string;
  tools?: string;
  cwd?: string;
  tips?: [string, string, string];
  force?: boolean;
}

const DEFAULT_TIPS: [string, string, string] = [
  "Describe what you want Mira to do and press Enter",
  "Type ? or /help to see all available commands",
  "Press Ctrl+C at any time to cancel a running task",
];

const ICON_APP = "✦";
const ICON_FOLDER = "▸";
const ICON_STAT = "◆";
 
const GAP_WORDMARK_GHOST = 3;
const GAP_STAT_BOXES = 2;
 
function visibleLen(str: string): number {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*[mGKHFJ]/g, "").length;
}
 
function pad(str: string, width: number): string {
  const v = visibleLen(str);
  return v >= width ? str : str + " ".repeat(width - v);
}
 
function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}
 
function formatCwd(cwd: string, maxLen: number): string {
  const home = process.env["HOME"] ?? process.env["USERPROFILE"] ?? "";
  const shortened = home ? cwd.replace(home, "~") : cwd;
  return shortened.length > maxLen
    ? "…" + shortened.slice(-(maxLen - 1))
    : shortened;
}
 
function getGhostArt(): string[] {
  const r = (s: string) => chalk.hex("#fd4441")(s);
  const y = (s: string) => chalk.hex("#FFC107")(s);
  const w = (s: string) => chalk.white(s);
 
  return [
    y("   ▄ ▄  ▄ ▄   "),
    y("  ╔████████╗  "),
    r(" ▐██████████▌ "),
    r(" ▐█") + w("██") + r("████") + w("██") + r("█▌ "),
    r(" ▐██████████▌ "),
    r(" ▐██████████▌ "),
    r("  ██  ██  ██  "),
  ];
}
 
function box(lines: string[], t: Theme, paddingX = 1): string[] {
  const width = Math.max(...lines.map(visibleLen));
  const horiz = "─".repeat(width + paddingX * 2);
  const top = t.primary(`╭${horiz}╮`);
  const bottom = t.primary(`╰${horiz}╯`);
  const sidePad = " ".repeat(paddingX);
 
  const body = lines.map(
    (l) => t.primary("│") + sidePad + pad(l, width) + sidePad + t.primary("│")
  );
 
  return [top, ...body, bottom];
}
 
function keyBadge(label: string): string {
  return chalk.gray("[") + chalk.white.bold(` ${label} `) + chalk.gray("]");
}
 
function renderTipLine(tip: string): string {
  return tip
    .split(/(`[^`]+`)/g)
    .map((part) =>
      part.startsWith("`") && part.endsWith("`")
        ? keyBadge(part.slice(1, -1))
        : chalk.white(part)
    )
    .join("");
}
 
function printHeaderBox(version: string, subtitle: string, t: Theme): void {
  const content =
    `${ICON_APP} ` +
    t.primary.bold("Mira CLI") +
    " " +
    t.muted(`v${version}`) +
    t.muted("  │  ") +
    chalk.white.bold(subtitle);
 
  console.log(box([content], t, 2).join("\n"));
}
 
function isBlankLine(line: string): boolean {
  // eslint-disable-next-line no-control-regex
  return line.replace(/\x1b\[[0-9;]*[mGKHFJ]/g, "").trim().length === 0;
}

function trimBlankLines(lines: string[]): string[] {
  let start = 0;
  let end = lines.length;
  while (start < end && isBlankLine(lines[start])) start++;
  while (end > start && isBlankLine(lines[end - 1])) end--;
  return lines.slice(start, end);
}

function printWordmarkRow(): void {
  const rawMira = figlet.textSync("MIRA", { 
    font: "ANSI Shadow" 
  });

  const coloredMira = gradient([
    "#D32F2F",
    "#FF5252",
    "#FF6868",
  ])(rawMira);

  const miraLines = trimBlankLines(coloredMira.split("\n"));
  const ghostLines = getGhostArt();

  const miraHeight = miraLines.length;
  const ghostHeight = ghostLines.length;
  const totalHeight = Math.max(miraHeight, ghostHeight);

  const padTop = (height: number) => Math.ceil((totalHeight - height) / 2);

  const paddedMira = [...Array(padTop(miraHeight)).fill(""), ...miraLines];
  while (paddedMira.length < totalHeight) paddedMira.push("");

  const paddedGhost = [...Array(padTop(ghostHeight)).fill(""), ...ghostLines];
  while (paddedGhost.length < totalHeight) paddedGhost.push("");

  const miraWidth = Math.max(
    ...miraLines.map(line => visibleLen(line))
  );

  const rows: string[] = [];

  for (let i = 0; i < totalHeight; i++) {
    const left = pad(
      paddedMira[i] ?? "",
      miraWidth
    );

    const right = paddedGhost[i] ?? "";

    rows.push(
      left +
      " ".repeat(GAP_WORDMARK_GHOST) +
      right
    );
  }

  console.log(rows.join("\n"));
}
 
function printTips(tips: string[], t: Theme): void {
  console.log(t.primary.bold("TIPS FOR GETTING STARTED"));
  tips.forEach((tip, i) => {
    console.log(`${t.primary.bold(`${i + 1}.`)} ${renderTipLine(tip)}`);
  });
}
 
function printCwd(cwdPath: string, t: Theme): void {
  console.log(`${ICON_FOLDER} ${t.muted(cwdPath)}`);
}
 
function statBox(label: string, value: string, t: Theme): string[] {
  const content =
    `${ICON_STAT} ` + t.muted(label.toUpperCase()) + " " + t.secondary.bold(value);
  return box([content], t, 2);
}
 
function printStatusBar(model: string, mcp: string, tools: string, t: Theme): void {
  const boxes = [
    statBox("model", model, t),
    statBox("mcp", mcp, t),
    statBox("tools", tools, t),
  ];
 
  const height = Math.max(...boxes.map((b) => b.length));
  const gap = " ".repeat(GAP_STAT_BOXES);
  const rows: string[] = [];
  for (let i = 0; i < height; i++) {
    rows.push(boxes.map((b) => b[i] ?? "").join(gap));
  }
  console.log(rows.join("\n"));
}
 
export function printBanner(options: BannerOptions = {}): void {
  if (!isTTY && !options.force) return;
 
  const t = getTheme();
 
  const version = options.version ?? "0.1.0";
  const subtitle = options.subtitle ?? "Welcome back!";
  const modelStr = truncate(options.model ?? "no model", 24);
  const mcpStr = truncate(options.mcpServer ?? "0 servers", 20);
  const toolsStr = truncate(options.tools ?? "0 active", 16);
  const cwd = formatCwd(options.cwd ?? process.cwd(), 60);
  const tips = options.tips ?? DEFAULT_TIPS;
 
  printHeaderBox(version, subtitle, t);
  console.log();
  printWordmarkRow();
  console.log();
  printTips(tips, t);
  console.log();
  printCwd(cwd, t);
  console.log();
  printStatusBar(modelStr, mcpStr, toolsStr, t);
}