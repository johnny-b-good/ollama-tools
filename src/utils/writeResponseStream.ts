import { type AbortableAsyncIterator, type ChatResponse } from "ollama";
import chalk from "chalk";

/**
 * Write streamed ollama response to stdout and return full text
 */
export const writeResponseStream = async (
  characterDisplayName: string,
  response: AbortableAsyncIterator<ChatResponse>,
) => {
  process.stdout.write(chalk.red(`[${characterDisplayName}]: `));
  let responseText = "";
  for await (const part of response) {
    process.stdout.write(part.message.content);
    responseText += part.message.content;
  }
  process.stdout.write("\n");
  return responseText;
};
