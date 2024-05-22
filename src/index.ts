import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
  CompletionUsage,
} from "openai/resources/index.mjs";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function main() {
  const usage: CompletionUsage[] = [];

  // append messages to this conversation, the chat does not have a memory.
  const conversation: Array<ChatCompletionMessageParam> = [
    {
      role: "system",
      content:
        `You are a coding assistant, generating complete source code files based on instructions. ` +
        `Only output the file contents, without any explanation. ` +
        `You always output Javascript files, to be run in node.js.`,
    },
    {
      role: "user",
      content:
        "Create a new file, called index.js, and start a new Fastify server on port 3000. It should respond to GET requests to the root URL with 'Hello, world!'",
    },
  ];

  let completion = await openai.chat.completions.create({
    messages: conversation,
    model: "gpt-3.5-turbo-0125",
  });

  console.dir(completion, { depth: null });

  if (completion.choices.length > 1) {
    console.error("Expected only one completion choice");
  }

  usage.push(completion.usage!);

  let completionChoice = completion.choices[0];
  process.stdout.write(completionChoice.message.content as string);
  process.stdout.write("\n");

  conversation.push(completionChoice.message);
  conversation.push({
    role: "user",
    content: "Add a package.json file with all necessary dependencies.",
  });

  completion = await openai.chat.completions.create({
    messages: conversation,
    model: "gpt-3.5-turbo-0125",
  });

  usage.push(completion.usage!);
  completionChoice = completion.choices[0];
  process.stdout.write(completionChoice.message.content as string);
  process.stdout.write("\n");

  console.log("Usage:");
  console.dir(usage, { depth: null });
}

main().catch(console.error);
