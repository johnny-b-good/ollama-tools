import ollama from "ollama";
import chalk from "chalk";
import { input } from "@inquirer/prompts";

import { exit, writeResponseStream } from "../../utils";
import { type SystemState } from "../../types";
import { detectCommands, processComands } from "./chatCommands";

export const runChatMode = async (state: SystemState) => {
  const { messages, modelName, modelReasoning, characterDisplayName } = state;

  while (true) {
    let prompt = "";
    try {
      prompt = await input({ message: chalk.blue("[User]:") });
    } catch {
      return exit("normal", "Exiting");
    }

    if (detectCommands(prompt)) {
      await processComands(prompt, state);
    } else {
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
  }
};
