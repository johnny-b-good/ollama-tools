import { execSync } from "node:child_process";

import { type Tool } from "ollama";

export const fileDetectTool: Tool = {
  type: "function",
  function: {
    name: "fileDetect",
    description: "Get type of file. Wrapper for the 'file' command.",
    parameters: {
      type: "object",
      required: ["path"],
      properties: {
        path: { type: "string", description: "Path to target file" },
      },
    },
  },
};

export const fileDetectFunction = ({ path }: { path: string }) => {
  return execSync(`file ${path}`, { encoding: "utf-8" });
};
