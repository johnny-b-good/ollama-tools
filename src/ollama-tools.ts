import { type Message } from "ollama";

import { selectCharacter, selectModelWithSettings } from "./configSteps";
import { exit } from "./utils";
import { runChatMode, runToolsMode } from "./systemModes";

const main = async () => {
  const messages: Message[] = [];

  const { modelName, systemMode, modelReasoning } =
    await selectModelWithSettings();

  const { characterName, characterSystemPrompt } = await selectCharacter();

  const characterDisplayName = characterName ?? modelName;

  if (characterSystemPrompt) {
    messages.push({
      role: "system",
      content: characterSystemPrompt,
    });
  }

  if (systemMode === "chat") {
    await runChatMode({
      messages,
      modelName,
      modelReasoning,
      characterDisplayName,
    });
  } else if (systemMode === "tools") {
    await runToolsMode({ messages, modelName, characterDisplayName });
  }
};

main().catch((error) => {
  exit("error", error.toString());
});
