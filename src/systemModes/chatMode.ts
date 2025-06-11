import readline from "node:readline/promises";

import ollama, { type Message } from "ollama";
import chalk from "chalk";

import { exit, writeResponseStream } from "../utils";

export const runChatMode = async ({
  messages,
  modelName,
  modelReasoning,
  characterDisplayName,
}: {
  messages: Message[];
  modelName: string;
  modelReasoning: boolean;
  characterDisplayName: string;
}) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    let prompt = "";
    try {
      prompt = await rl.question(chalk.blue("[User]: "));
    } catch {
      return exit("normal", "Exiting");
    }

    messages.push({
      role: "user",
      content: prompt,
    });

    const response = await ollama.chat({
      model: modelName,
      stream: true,
      messages,
      think: modelReasoning,
    });

    const responseText = await writeResponseStream(
      characterDisplayName,
      response,
    );

    messages.push({
      role: "assistant",
      content: responseText,
    });
  }
};
