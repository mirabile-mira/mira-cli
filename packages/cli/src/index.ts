/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { loadEnvFromCwd } from "@mira/shared";
import { Command } from "commander";
import { createRequire } from "module";

loadEnvFromCwd();

const require = createRequire(import.meta.url);
 
const { version } = require("../package.json") as { version: string };

const program = new Command();

program
.name('mira')
.description("An AI agent that lives inside your terminal")
.version(version, "-v, --version", "Print the current mira-cli version")
.helpOption("-h, --help", "Display help for command")
.addHelpText(
"after",
    `
Examples:
  $ mira chat                    Start an interactive AI chat session
  $ mira agent run ./task.md     Run an autonomous agent task
  $ mira login                   Authenticate with the Mira platform
  $ mira config set model gpt-4  Set a configuration value
    `
);

program
  .command("chat")
  .description("Start an interactive AI chat session in your terminal")
  .option("-m, --model <model>", "Model to use for the session")
  .option("--no-stream", "Disable streaming output")
  .action(async (options) => {
    const { runChat } = await import("./commands/chat.js");
    await runChat(options);
  });
 
program
  .command("agent")
  .description("Run an autonomous AI agent")
  .argument("[task]", "Task description or path to a task file")
  .option("--dry-run", "Preview actions without executing them")
  .option("-m, --model <model>", "Model to use for the agent")
  .action(async (task, options) => {
    const { runAgent } = await import("./commands/agent.js");
    await runAgent(task, options);
  });
 
program
  .command("login")
  .description("Authenticate with the Mira platform")
  .option("--token <token>", "Provide an API token directly (non-interactive)")
  .action(async (options) => {
    const { runLogin } = await import("./commands/login.js");
    await runLogin(options);
  });
 
program
  .command("logout")
  .description("Log out and clear stored credentials")
  .action(async () => {
    const { runLogout } = await import("./commands/logout.js");
    await runLogout();
  });
 
const plugin = program
  .command("plugin")
  .description("Manage mira plugins");
 
plugin
  .command("list")
  .description("List installed plugins")
  .action(async () => {
    const { runPluginList } = await import("./commands/plugin.js");
    await runPluginList();
  });
 
plugin
  .command("install <name>")
  .description("Install a plugin")
  .action(async (name) => {
    const { runPluginInstall } = await import("./commands/plugin.js");
    await runPluginInstall(name);
  });
 
plugin
  .command("remove <name>")
  .description("Remove a plugin")
  .action(async (name) => {
    const { runPluginRemove } = await import("./commands/plugin.js");
    await runPluginRemove(name);
  });
 
const skill = program
  .command("skill")
  .description("Manage agent skills");
 
skill
  .command("list")
  .description("List available skills")
  .action(async () => {
    const { runSkillList } = await import("./commands/skill.js");
    await runSkillList();
  });
 
skill
  .command("add <name>")
  .description("Add a skill to the agent")
  .action(async (name) => {
    const { runSkillAdd } = await import("./commands/skill.js");
    await runSkillAdd(name);
  });
 
const mcp = program
  .command("mcp")
  .description("Manage Model Context Protocol servers");
 
mcp
  .command("list")
  .description("List configured MCP servers")
  .action(async () => {
    const { runMcpList } = await import("./commands/mcp.js");
    await runMcpList();
  });
 
mcp
  .command("add <server>")
  .description("Register an MCP server")
  .action(async (server) => {
    const { runMcpAdd } = await import("./commands/mcp.js");
    await runMcpAdd(server);
  });
 
const config = program
  .command("config")
  .description("View and set mira configuration");
 
config
  .command("get <key>")
  .description("Get a config value")
  .action(async (key) => {
    const { runConfigGet } = await import("./commands/config.js");
    await runConfigGet(key);
  });
 
config
  .command("set <key> <value>")
  .description("Set a config value")
  .action(async (key, value) => {
    const { runConfigSet } = await import("./commands/config.js");
    await runConfigSet(key, value);
  });
 
config
  .command("list")
  .description("List all config values")
  .action(async () => {
    const { runConfigList } = await import("./commands/config.js");
    await runConfigList();
  });
 
program.on("command:*", (operands: string[]) => {
  console.error(`\n  error: unknown command '${operands[0]}'\n`);
  console.error(`  Run 'mira --help' to see available commands.\n`);
  process.exitCode = 1;
});
 
program.parse(process.argv);