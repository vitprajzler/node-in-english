import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function main() {
  const content = await openai.files.content("file-az2EkTdtXGfRtnOR7EuKMRod");
  content.body.pipe(process.stdout);
}

main().catch(console.error);
