import { execSync } from "node:child_process";

import { type Tool } from "ollama";

export const lsTool: Tool = {
  type: "function",
  function: {
    name: "ls",
    description:
      "List files in a directory. Wrapper for the 'ls -hal' command.",
    parameters: {
      type: "object",
      required: ["path"],
      properties: {
        path: { type: "string", description: "Path to target directory" },
      },
    },
  },
};

export const lsFunction = ({ path }: { path: string }) => {
  return execSync(`ls -hal ${path}`, { encoding: "utf-8" });
};
