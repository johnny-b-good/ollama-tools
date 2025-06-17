import { type Message } from "ollama";

import { selectCharacter, selectModelWithSettings } from "./configSteps";
import { exit } from "./utils";
import { runChatMode, runToolsMode } from "./systemModes";
import { SystemState } from "./types";

const main = async () => {
  const messages: Message[] = [];

  const { modelName, systemMode, modelReasoning } =
    await selectModelWithSettings();

  const { characterName, characterSystemPrompt } = await selectCharacter();

  const characterDisplayName = characterName ?? modelName;

  const systemState: SystemState = {
    modelName,
    systemMode,
    modelReasoning,
    characterName,
    characterSystemPrompt,
    characterDisplayName,
    messages,
  };

  if (characterSystemPrompt) {
    messages.push({
      role: "system",
      content: characterSystemPrompt,
    });
  }

  if (systemMode === "chat") {
    await runChatMode(systemState);
  } else if (systemMode === "tools") {
    await runToolsMode(systemState);
  }
};

main().catch((error) => {
  exit("error", error.toString());
});
