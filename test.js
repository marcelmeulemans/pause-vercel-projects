import "dotenv/config";
import got from "got";
import { program } from "commander";
import { sha1 } from "./utils.js";

const { INTEGRATION_SECRET } = process.env;

async function post(path, body = {}) {
  const bodyBuffer = Buffer.from(JSON.stringify(body), "utf8");
  return await got.post(`http://localhost:3000/api/${path}`, {
    headers: { "X-Vercel-Signature": sha1(bodyBuffer, INTEGRATION_SECRET) },
    body: bodyBuffer,
  });
}

program
  .command("pause")
  .description("test pausing all projects in your vercel team")
  .action(async () => {
    const response = await post("pause");
    console.log(response.statusMessage);
  });

program
  .command("unpause")
  .description("test pausing all projects in your vercel team")
  .action(async () => {
    const response = await post("unpause");
    console.log(response.statusMessage);
  });

program.parse();
