import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const ASSISTANT_ID = "asst_w4Jw7PxuPGtl8tS4i2eJiaPu";

async function main() {
  // const assistant = await openai.beta.assistants.retrieve(
  //   "asst_w4Jw7PxuPGtl8tS4i2eJiaPu"
  // );

  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content:
          "Create a new file, called index.js, which starts a new Fastify server on port 3000.",
      },
    ],
  });

  console.log(`Created thread ${thread.id}`);

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: ASSISTANT_ID,
  });

  console.log(run);

  if (run.status == "completed") {
    const messages = await openai.beta.threads.messages.list(thread.id);
    for (const message of messages.data) {
      console.log(message);
    }
  }
}

main().catch(console.error);
