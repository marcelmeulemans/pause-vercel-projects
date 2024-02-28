import "dotenv/config";
import got from "got";
import { program } from "commander";
import { sha1 } from "./utils.js";

const { INTEGRATION_SECRET } = process.env;
const DEFAULT_URL = "http://localhost:3000";

async function post(path, body = {}, url = DEFAULT_URL) {
  const bodyBuffer = Buffer.from(JSON.stringify(body), "utf8");
  return await got.post(`${url}/api/${path}`, {
    headers: { "X-Vercel-Signature": sha1(bodyBuffer, INTEGRATION_SECRET) },
    body: bodyBuffer,
  });
}

program
  .command("pause")
  .description("test pausing all projects in your vercel team")
  .option("-u --url [url]", "change the url to test with")
  .action(async () => {
    const response = await post("pause");
    console.log(response.statusMessage);
  });

program
  .command("unpause")
  .description("test pausing all projects in your vercel team")
  .option("-u --url [url]", "change the url to test with")
  .action(async () => {
    const response = await post("unpause");
    console.log(response.statusMessage);
  });

program.parse();
