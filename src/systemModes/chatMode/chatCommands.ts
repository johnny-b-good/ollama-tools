import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

import { input } from "@inquirer/prompts";

import { logger } from "../../utils";
import { SystemState } from "../../types/SystemState";

enum ChatCommand {
  Save = "/save",
}

export const detectCommands = (message: string): boolean => {
  return Object.values<string>(ChatCommand).includes(message);
};

export const processComands = async (command: string, state: SystemState) => {
  if (command === ChatCommand.Save) {
    const sessionFilesDirPath = path.join(
      import.meta.dirname,
      "..",
      "..",
      "..",
      "sessions",
    );

    await mkdir(sessionFilesDirPath, { recursive: true });

    let fileNameIsOk = false;
    let filePath = "";

    while (!fileNameIsOk) {
      const fileName = await input({
        message: "Enter file name to save current session",
      });

      filePath = path.join(sessionFilesDirPath, fileName);

      try {
        await stat(filePath);
        console.log("A file with this name already exists");
      } catch {
        fileNameIsOk = true;
      }
    }

    const stateString = JSON.stringify(state, undefined, 4);

    await writeFile(filePath, stateString, "utf-8");
    console.log(`The session has been saved at ${filePath}`);
  } else {
    logger.error("Command error");
  }
};
