import readline from "node:readline/promises";

import ollama, { type Message } from "ollama";
import chalk from "chalk";

import { exit, writeResponseStream, logger } from "../utils";
import { allTools, availableFunctions } from "../aiTools";

export const runToolsMode = async ({
  messages,
  modelName,
  characterDisplayName,
}: {
  messages: Message[];
  modelName: string;
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

    logger.info("Running tools");
    const response = await ollama.chat({
      model: modelName,
      messages,
      tools: allTools,
    });

    const toolCalls = response.message.tool_calls;
    messages.push(response.message);

    // TODO: Remove me
    logger.info(response, "Response");

    if (toolCalls) {
      for (const toolCall of toolCalls) {
        const functionToCall = availableFunctions[toolCall.function.name];
        if (functionToCall) {
          const output = functionToCall(toolCall.function.arguments);
          messages.push({
            role: "tool",
            content: output.toString(),
          });
        } else {
          logger.info("Function", toolCall.function.name, "not found");
        }
      }

      const finalResponse = await ollama.chat({
        model: modelName,
        messages: messages,
        stream: true,
      });

      const finalResponseText = await writeResponseStream(
        characterDisplayName,
        finalResponse,
      );

      messages.push({
        role: "assistant",
        content: finalResponseText,
      });
    } else {
      console.log("No tool calls");
    }
  }
};
