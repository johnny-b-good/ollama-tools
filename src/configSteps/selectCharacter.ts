import { readFile } from "node:fs/promises";
import path from "node:path";

import { select } from "@inquirer/prompts";
import { z } from "zod";

import { logger } from "../utils";

const charactersSchema = z.record(z.string().min(1));

type Characters = z.infer<typeof charactersSchema>;

export const selectCharacter = async () => {
  let charactersFile: string | null = null;
  try {
    const characterFilePath = path.join(
      import.meta.dirname,
      "..",
      "..",
      "characters.json",
    );
    charactersFile = await readFile(characterFilePath, "utf-8");
  } catch {
    logger.warn("Can't read 'characters.json' file");
  }

  let characters: Characters = {};
  try {
    if (charactersFile) {
      characters = charactersSchema.parse(JSON.parse(charactersFile));
    }
  } catch {
    logger.warn("Failed to parse 'characters.json' file");
  }

  let characterName: string | null = null;
  let characterSystemPrompt: string | null = null;

  if (Object.keys(characters).length > 0) {
    characterName = await select({
      message: "Select a character",
      choices: [
        { name: "Default", value: null },
        ...Object.keys(characters).map((name) => ({ name, value: name })),
      ],
    });

    characterSystemPrompt = characterName ? characters[characterName] : null;
  } else {
    logger.info("Using default system prompt");
  }

  return { characterName, characterSystemPrompt };
};
