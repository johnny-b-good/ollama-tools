import { datetimeTool, datetimeFunction } from "./datetime";
import { lsTool, lsFunction } from "./ls";
import { getHomeDirTool, getHomeDirFunction } from "./getHomeDir";

export const allTools = [datetimeTool, lsTool, getHomeDirTool];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const availableFunctions: Record<string, (...args: any[]) => string> = {
  datetime: datetimeFunction,
  ls: lsFunction,
  getHomeDir: getHomeDirFunction,
};
