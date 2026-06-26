/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ThemeName, themeNames } from "@mira/shared";
import chalk from "chalk";

export type { ThemeName };

export interface Theme {
    name: ThemeName;
    primary: chalk.Chalk;
    secondary: chalk.Chalk;
    accent: chalk.Chalk;
    success: chalk.Chalk;
    warning: chalk.Chalk;
    error: chalk.Chalk;
    muted: chalk.Chalk;
    bold: chalk.Chalk; 
}

const themes: Record<ThemeName, Theme> = {
    default: {
        name: "default",
        primary: chalk.redBright,
        secondary: chalk.white,
        accent: chalk.white,
        success: chalk.green,
        warning: chalk.yellow,
        error: chalk.red,
        muted: chalk.gray,
        bold: chalk.bold,
    },
    ocean: {
      name: "ocean",
      primary: chalk.hex("#00BFFF"),
      secondary: chalk.hex("#1E90FF"),
      accent: chalk.hex("#7B68EE"),
      success: chalk.hex("#00FA9A"),
      warning: chalk.hex("#FFD700"),
      error: chalk.hex("#FF6347"),
      muted: chalk.hex("#708090"),
      bold: chalk.bold,
    },
    sunset: {
      name: "sunset",
      primary: chalk.hex("#FF7F50"),
      secondary: chalk.hex("#FF4500"),
      accent: chalk.hex("#DA70D6"),
      success: chalk.hex("#98FB98"),
      warning: chalk.hex("#FFD700"),
      error: chalk.hex("#DC143C"),
      muted: chalk.hex("#A9A9A9"),
      bold: chalk.bold,
    },
    forest: {
      name: "forest",
      primary: chalk.hex("#228B22"),
      secondary: chalk.hex("#32CD32"),
      accent: chalk.hex("#8FBC8F"),
      success: chalk.hex("#00FF7F"),
      warning: chalk.hex("#DAA520"),
      error: chalk.hex("#8B0000"),
      muted: chalk.hex("#696969"),
      bold: chalk.bold,
    },
    mono: {
      name: "mono",
      primary: chalk.white,
      secondary: chalk.whiteBright,
      accent: chalk.white,
      success: chalk.whiteBright,
      warning: chalk.white,
      error: chalk.white.bold,
      muted: chalk.gray,
      bold: chalk.bold,
    },
};

let activeTheme: Theme = themes.default;

export function getTheme(): Theme {
    return activeTheme;
}

export function setTheme(name: ThemeName): void {
    activeTheme = themes[name];
}

export function getAllThemes(): ThemeName[] {
    return [...themeNames];
}

export { themes };