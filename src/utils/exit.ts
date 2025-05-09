import ollama from "ollama";

import { logger } from "./logger";

export const exit = (mode: "error" | "normal", reason: string) => {
  if (mode === "error") {
    logger.error(reason);
  } else {
    logger.info(reason);
  }

  ollama.abort();

  process.exit(1);
};
