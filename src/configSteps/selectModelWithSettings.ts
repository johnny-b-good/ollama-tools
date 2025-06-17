import { readFile } from "node:fs/promises";
import path from "node:path";

import { select } from "@inquirer/prompts";
import { z } from "zod";

import { exit } from "../utils";
import { SystemMode } from "../types/SystemMode";

const modelSchema = z.object({
  name: z.string().min(1),
  hasTools: z.boolean().optional(),
  hasReasoning: z.boolean().optional(),
});

const modelsSchema = z.array(modelSchema);

type Model = z.infer<typeof modelSchema>;

export const selectModelWithSettings = async () => {
  let modelsFile: string;
  try {
    const modelFilePath = path.join(
      import.meta.dirname,
      "..",
      "..",
      "models.json",
    );
    modelsFile = await readFile(modelFilePath, "utf-8");
  } catch {
    return exit("error", "Can't read 'models.json' file");
  }

  let models: Array<Model>;
  try {
    models = modelsSchema.parse(JSON.parse(modelsFile));
  } catch {
    return exit("error", "Failed to parse 'models.json' file");
  }

  if (models.length === 0) {
    return exit("error", "No models defined");
  }

  const model = await select<Model>({
    message: "Select a model",
    choices: models.map((model) => ({ name: model.name, value: model })),
  });

  if (!model) {
    return exit("error", "Model not found");
  }

  let systemMode: SystemMode = "chat";
  if (model.hasTools) {
    systemMode = await select<SystemMode>({
      message: "Select mode",
      choices: [
        { name: "Chat", value: "chat" },
        { name: "Tools", value: "tools" },
      ],
    });
  }

  let modelReasoning: boolean = false;
  if (model.hasReasoning) {
    modelReasoning = await select<boolean>({
      message: "Enable reasoning",
      choices: [
        { name: "Enable", value: true },
        { name: "Disable", value: false },
      ],
    });
  }

  return { modelName: model.name, systemMode, modelReasoning };
};
