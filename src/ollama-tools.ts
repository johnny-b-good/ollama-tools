import { type Message } from "ollama";

import { selectCharacter, selectModelAndToolsUsage } from "./configSteps";
import { exit } from "./utils";
import { runChatMode, runToolsMode } from "./systemModes";

const main = async () => {
  const messages: Message[] = [];

  const { modelName, mode } = await selectModelAndToolsUsage();

  const { characterName, characterSystemPrompt } = await selectCharacter();

  const characterDisplayName = characterName ?? modelName;

  if (characterSystemPrompt) {
    messages.push({
      role: "system",
      content: characterSystemPrompt,
    });
  }

  if (mode === "chat") {
    await runChatMode({ messages, modelName, characterDisplayName });
  } else if (mode === "tools") {
    await runToolsMode({ messages, modelName, characterDisplayName });
  }
};

main().catch((error) => {
  exit("error", error.toString());
});
