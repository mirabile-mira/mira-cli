/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from "vitest";

import { miraConfigSchema } from "../schema.js";

describe("miraConfigSchema", () => {
  it("applies defaults from an empty object", () => {
    const config = miraConfigSchema.parse({});

    expect(config).toEqual({
      configVersion: 1,
      model: "claude-sonnet-4.6",
      theme: "default",
      mcpServers: [],
      sandbox: [],
      skills: [],
      plugins: [],
      setting: {},
    });
    expect(config.authToken).toBeUndefined();
    expect(config.defaultPlugin).toBeUndefined();
  });

  it("rejects an invalid theme", () => {
    const result = miraConfigSchema.safeParse({ theme: "neon" });
    expect(result.success).toBe(false);
  });

  it("rejects unknown top-level keys", () => {
    const result = miraConfigSchema.safeParse({ unknownKey: true });
    expect(result.success).toBe(false);
  });

  it("parses stdio MCP servers", () => {
    const config = miraConfigSchema.parse({
      mcpServers: [
        {
          type: "stdio",
          name: "test",
          command: "node",
          args: ["server.js"],
        },
      ],
    });

    expect(config.mcpServers).toHaveLength(1);
    expect(config.mcpServers[0]).toMatchObject({
      type: "stdio",
      name: "test",
      command: "node",
    });
  });

  it("parses sse and http MCP servers", () => {
    const config = miraConfigSchema.parse({
      mcpServers: [
        {
          type: "sse",
          name: "remote-sse",
          url: "https://example.com/sse",
        },
        {
          type: "http",
          name: "remote-http",
          url: "https://example.com/mcp",
        },
      ],
    });

    expect(config.mcpServers).toHaveLength(2);
  });

  it("rejects MCP servers missing type", () => {
    const result = miraConfigSchema.safeParse({
      mcpServers: [{ name: "test", command: "node" }],
    });
    expect(result.success).toBe(false);
  });
});
