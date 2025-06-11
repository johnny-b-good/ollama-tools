export const toolsInitPrompt = (userTask: string, toolsDescription: string) =>
  `The user gave you the following task: "${userTask}". You must complete this task in a most efficient way. You can complete the task in multiple steps, but the number of steps is limited, so use them carefully. You have access to following tools: "${toolsDescription}". Your actions absolutely should not harm the user or his data in any way. You absolutely should not fabricate any data or tools. ${REPLY_FORMAT_INSTRUCTIONS}`;

export const badToolNameErrorPrompt = (toolName: string) =>
  `The tool with name "${toolName}" doesn't exist. Check the list of available tools. Pick the right tool for the current step. Each step should bring you closer to completion of the task. ${REPLY_FORMAT_INSTRUCTIONS}`;

export const badToolArgsErrorPrompt = (toolName: string, toolArgs: string) =>
  `The tool with name "${toolName}" doesn't accept arguments that you've provided: "${toolArgs}". Check the format of tool's required arguments. Repeat the tool call with correct arguments. ${REPLY_FORMAT_INSTRUCTIONS}`;

export const toolRuntimeErrorPrompt = (
  toolName: string,
  toolArgs: string,
  error: string,
) =>
  `The tool with name "${toolName}" called with arguments "${toolArgs}" have returned this error: "${error}". Make a conclusion if this error makes completing of user's task impossible. ${REPLY_FORMAT_INSTRUCTIONS}`;

export const toolNextStepPrompt = (
  toolName: string,
  toolArgs: string,
  result: string,
) =>
  `The tool with name "${toolName}" called with arguments "${toolArgs}" have returned this result: "${result}". ${REPLY_FORMAT_INSTRUCTIONS}`;

const REPLY_FORMAT_INSTRUCTIONS = `Evaluate current state of the task completion. Decide what should be done next with the current state and available tools. You must reply to this message with JSON-formatted string. The data structure of the reply depends on your next step decision. If task is complete, you should report task results to the user. The format should be "{'status': 'complete', 'report': '<your report of successful task result>'}". If task couldn't be completed with available tools, you should report the situation to the user. The format should be "{'status': 'impossible', 'report': '<your reasoning on>'}" If there is a next possible step to the task completion, make a required tool call. `;
