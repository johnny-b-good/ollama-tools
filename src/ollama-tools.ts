import ollama, { type Message } from "ollama";
import readline from "node:readline/promises";

const MODEL = "qwen3:14b";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const main = async () => {
  const messages: Message[] = [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
  ];

  while (true) {
    const prompt = await rl.question(">>> ");

    messages.push({
      role: "user",
      content: prompt,
    });

    const response = await ollama.chat({
      model: MODEL,
      stream: true,
      messages,
    });

    for await (const chunk of response) {
      process.stdout.write(chunk.message.content);
    }

    console.log("\n");
  }
};

main()
  .catch((error) => {
    console.error("Error:", error);
    ollama.abort();
  })
  .finally(() => {
    rl.close();
  });
