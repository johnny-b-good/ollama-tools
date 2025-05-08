import readline from "node:readline/promises";

import ollama, { type Message } from "ollama";
import chalk from "chalk";

import { allTools, availableFunctions } from "./aiTools";
import { selectCharacter, selectModelAndToolsUsage } from "./configSteps";

const main = async () => {
  const messages: Message[] = [];

  const { modelName, toolsEnabled } = await selectModelAndToolsUsage();

  const { characterName, characterSystemPrompt } = await selectCharacter();

  const characterDisplayName = characterName ?? modelName;

  if (characterSystemPrompt) {
    messages.push({
      role: "system",
      content: characterSystemPrompt,
    });
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    let prompt = "";
    try {
      prompt = await rl.question(chalk.blue("[User]: "));
    } catch {
      console.log("Exiting");
      ollama.abort();
      process.exit(1);
    }

    messages.push({
      role: "user",
      content: prompt,
    });

    if (!toolsEnabled) {
      const response = await ollama.chat({
        model: modelName,
        stream: true,
        messages,
      });

      let responseText = "";
      process.stdout.write(chalk.red(`[${characterDisplayName}]: `));
      for await (const chunk of response) {
        process.stdout.write(chunk.message.content);
        responseText += chunk.message.content;
      }

      messages.push({
        role: "assistant",
        content: responseText,
      });

      console.log("\n");
    } else {
      const response = await ollama.chat({
        model: modelName,
        messages,
        tools: allTools,
      });

      const responseText = response.message.content;
      const toolCalls = response.message.tool_calls;
      messages.push(response.message);
      console.log("Response:", responseText);
      console.log("Tool calls:", toolCalls);

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
            console.log("Function", toolCall.function.name, "not found");
          }
        }

        const finalResponse = await ollama.chat({
          model: modelName,
          messages: messages,
        });

        const finalResponseText = finalResponse.message.content;

        messages.push({
          role: "assistant",
          content: finalResponseText,
        });

        console.log(finalResponseText);
      } else {
        console.log("No tool calls");
      }
    }
  }
};

main()
  .catch((error) => {
    console.error("Error:", error);
    ollama.abort();
  })
  .finally(() => {
    console.log("Exiting");
  });
