/**
 * @license
 * Copyright 2026 Mirabile LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChatOptions {
    model? : string;
    stream? : boolean;
}

export async function runChat(options: ChatOptions): Promise<void> {
    console.log("TODO: Implement chat", options);
}