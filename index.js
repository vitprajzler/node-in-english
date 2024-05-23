import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
import fs from "fs/promises";

const OPENAI_MODEL = "gpt-3.5-turbo-0125";

/**
 *
 * @param {string} step
 * @param {ChatCompletionMessageParam[]} conversation
 * @param {"user" | "system"} role
 * @returns {Promise<{conversation: ChatCompletionMessageParam[], content: string, usage: CompletionUsage}>}
 */
async function step(step, conversation, role = "user") {
  conversation.push({
    role: role,
    content: step,
  });

  const completion = await openai.chat.completions.create({
    messages: conversation,
    model: OPENAI_MODEL,
  });

  if (completion.choices.length > 1) {
    console.error("Expected only one completion choice");
  }

  conversation.push(completion.choices[0].message);

  let sanitizedContent = completion.choices[0].message.content;
  sanitizedContent = sanitizedContent.trim();
  if (sanitizedContent.startsWith("```")) {
    // remove the first line
    const index = sanitizedContent.indexOf("\n");
    sanitizedContent = sanitizedContent.substring(index + 1);
  }
  if (sanitizedContent.endsWith("```")) {
    // remove the last line
    const index = sanitizedContent.lastIndexOf("\n");
    sanitizedContent = sanitizedContent.substring(0, index);
  }

  return {
    conversation,
    content: sanitizedContent,
    usage: completion.usage,
  };
}

/**
 *
 * @param {ChatCompletionMessageParam[]} conversation
 * @returns {Promise<{conversation: ChatCompletionMessageParam[], content: string, usage: CompletionUsage}>}
 */
async function addPackageJson(conversation) {
  return await step(
    `Add a package.json file with all necessary dependencies.` +
      `Make its license private, and add a start script.` +
      `Do not output any comments in this file.`,
    conversation
  );
}

/**
 *
 * @param {string} filename
 * @param {string} instructions
 * @param {ChatCompletionMessageParam[]} conversation
 * @returns {Promise<{conversation: ChatCompletionMessageParam[], content: string, usage: CompletionUsage}>}
 */
async function addFile(filename, instructions, conversation) {
  return await step(`Add a file named ${filename}. In the file, ${instructions}`, conversation);
}

async function main() {
  /**
   * @type {CompletionUsage[]}
   */
  const usage = [];

  // append messages to this conversation, the chat does not have a memory.
  /**
   * @type {Array<ChatCompletionMessageParam>}
   */
  let conversation = [
    {
      role: "system",
      content:
        `You are a coding assistant, generating complete source code files based on instructions. ` +
        `Only output the file contents, without any explanation. ` +
        `You always output Javascript files, to be run in node.js.`,
    },
  ];

  const indexContent = await fs.readFile(`./text-src/index.txt`, "utf-8");
  let indexStep = await step(indexContent, conversation, "system");
  conversation = indexStep.conversation;
  usage.push(indexStep.usage);

  await fs.mkdir("./dist");
  // for now, manually / explicitly sort the files
  const files = ["quote-of-the-day.txt", "ping.txt", "root.txt", "server.txt"];

  for (const file of files) {
    const fileContent = await fs.readFile(`./text-src/${file}`, "utf-8");
    const jsFilename = file.substring(0, file.length - 4) + ".js";

    const s = await addFile(jsFilename, fileContent, conversation);

    await fs.writeFile(`./dist/${jsFilename}`, s.content, "utf-8");
    usage.push(s.usage);
    conversation = s.conversation;
  }

  const packageJson = await addPackageJson(conversation);
  await fs.writeFile("./dist/package.json", packageJson.content);
  usage.push(packageJson.usage);

  console.dir(conversation, { depth: null });

  console.log("Token usage:");
  const usageSum = usage.reduce((acc, u) => {
    acc.total_tokens += u.total_tokens;
    acc.completion_tokens += u.completion_tokens;
    acc.prompt_tokens += u.prompt_tokens;
    return acc;
  });
  console.dir(usageSum, { depth: null });
}

main().catch(console.error);
