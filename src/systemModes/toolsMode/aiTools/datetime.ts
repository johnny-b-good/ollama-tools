import { type Tool } from "ollama";

export const datetimeTool: Tool = {
  type: "function",
  function: {
    name: "datetime",
    description: "Get the current date and time in ISO format",
  },
};

export const datetimeFunction = () => {
  return new Date().toISOString();
};
