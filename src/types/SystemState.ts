import { Message } from "ollama";
import { SystemMode } from "./SystemMode";

export type SystemState = {
  modelName: string;
  systemMode: SystemMode;
  modelReasoning: boolean;
  characterName: string | null;
  characterSystemPrompt: string | null;
  characterDisplayName: string;
  messages: Message[];
};
