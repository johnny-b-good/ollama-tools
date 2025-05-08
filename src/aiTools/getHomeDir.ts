import { execSync } from "node:child_process";

import { type Tool } from "ollama";

export const getHomeDirTool: Tool = {
  type: "function",
  function: {
    name: "getHomeDir",
    description: "Get user's home directory path.",
  },
};

export const getHomeDirFunction = () => {
  return execSync(`echo $HOME`, { encoding: "utf-8" });
};
