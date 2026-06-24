export interface ChatOptions {
    model? : string;
    stream? : boolean;
}

export async function runChat(options: ChatOptions): Promise<void> {
    console.log("TODO: Implement chat", options);
}