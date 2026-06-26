/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from "zod";

export const themeNames = [
  "default",
  "ocean",
  "forest",
  "sunset",
  "mono",
] as const;

export type ThemeName = (typeof themeNames)[number];

export const MCP_SERVER_TYPES = ["stdio", "sse", "http"] as const;

export type McpServerType = (typeof MCP_SERVER_TYPES)[number];

export const mcpServerSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("stdio"),
    name: z.string(),
    command: z.string(),
    args: z.array(z.string()).optional(),
    env: z.record(z.string(), z.string()).optional(),
  }),
  z.object({
    type: z.literal("sse"),
    name: z.string(),
    url: z.string().url(),
    headers: z.record(z.string(), z.string()).optional(),
  }),
  z.object({
    type: z.literal("http"),
    name: z.string(),
    url: z.string().url(),
    headers: z.record(z.string(), z.string()).optional(),
  }),
]);

export type McpServer = z.infer<typeof mcpServerSchema>;

export const sandboxSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  command: z.string().optional(),
  env: z.record(z.string(), z.string()).optional(),
});

export type Sandbox = z.infer<typeof sandboxSchema>;

const namedEnabledSchema = z.object({
  name: z.string(),
  enabled: z.boolean().default(true),
});

export type NamedEnabled = z.infer<typeof namedEnabledSchema>;

export const miraConfigSchema = z
  .object({
    configVersion: z.literal(1).default(1),
    model: z.string().min(1).default("claude-sonnet-4.6"),
    theme: z.enum(themeNames).default("default"),
    authToken: z.string().optional(),
    mcpServers: z.array(mcpServerSchema).default([]),
    defaultPlugin: z.string().optional(),
    sandbox: z.array(sandboxSchema).default([]),
    skills: z.array(namedEnabledSchema).default([]),
    plugins: z.array(namedEnabledSchema).default([]),
    setting: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();

export type MiraConfig = z.infer<typeof miraConfigSchema>;

export type MiraConfigKey = keyof MiraConfig;

export const CONFIG_KEYS = [
  "configVersion",
  "model",
  "theme",
  "authToken",
  "mcpServers",
  "defaultPlugin",
  "sandbox",
  "skills",
  "plugins",
  "setting",
] as const satisfies readonly MiraConfigKey[];

const JSON_VALUE_KEYS = new Set<MiraConfigKey>([
  "mcpServers",
  "sandbox",
  "skills",
  "plugins",
  "setting",
]);

export function isJsonValueKey(key: MiraConfigKey): boolean {
  return JSON_VALUE_KEYS.has(key);
}

export function isConfigKey(key: string): key is MiraConfigKey {
  return (CONFIG_KEYS as readonly string[]).includes(key);
}
