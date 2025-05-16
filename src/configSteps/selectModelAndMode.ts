import { readFile } from "node:fs/promises";
import path from "node:path";

import { select } from "@inquirer/prompts";
import { z } from "zod";

import { exit } from "../utils";

const modelSchema = z.object({
  name: z.string().min(1),
  hasTools: z.boolean(),
});

const modelsSchema = z.array(modelSchema);

type Model = z.infer<typeof modelSchema>;

type SystemMode = "chat" | "tools";

export const selectModelAndToolsUsage = async () => {
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

  const model = await select({
    message: "Select a model",
    choices: models.map((model) => ({ name: model.name, value: model })),
  });

  if (!model) {
    return exit("error", "Model not found");
  }

  let mode: SystemMode = "chat";
  if (model.hasTools) {
    mode = await select<SystemMode>({
      message: "Select mode",
      choices: [
        { name: "Chat", value: "chat" },
        { name: "Tools", value: "tools" },
      ],
    });
  }

  return { modelName: model.name, mode };
};
