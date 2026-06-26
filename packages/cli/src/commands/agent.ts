/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface agentOptions {
    model? : string;
    dryRun? : boolean;
}

export async function runAgent(task: string | undefined, options: agentOptions): Promise<void> {
    console.log("TODO: Implement agent", task, options);
}