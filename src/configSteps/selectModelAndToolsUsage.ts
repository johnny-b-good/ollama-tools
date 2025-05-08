import { readFile } from "node:fs/promises";
import path from "node:path";

import { select } from "@inquirer/prompts";
import { z } from "zod";

const modelSchema = z.object({
  name: z.string().min(1),
  hasTools: z.boolean(),
});

const modelsSchema = z.array(modelSchema);

type Model = z.infer<typeof modelSchema>;

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
    console.error("Can't read 'models.json' file");
    process.exit(1);
  }

  let models: Array<Model>;
  try {
    models = modelsSchema.parse(JSON.parse(modelsFile));
  } catch {
    console.error("Failed to parse 'models.json' file");
    process.exit(1);
  }

  if (models.length === 0) {
    console.error("No models defined");
    process.exit(1);
  }

  const model = await select({
    message: "Select a model",
    choices: models.map((model) => ({ name: model.name, value: model })),
  });

  if (!model) {
    console.error("Model not found");
    process.exit(1);
  }

  let toolsEnabled = false;
  if (model.hasTools) {
    toolsEnabled = await select({
      message: "Tools",
      choices: [
        { name: "Disabled", value: false },
        { name: "Enabled", value: true },
      ],
    });
  }

  return { modelName: model.name, toolsEnabled };
};
