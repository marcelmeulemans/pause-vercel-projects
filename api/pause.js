import getStream from "get-stream";
import { api, sha1 } from "../utils.js";

const { INTEGRATION_SECRET } = process.env;

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(404).end("Not Found");
      return;
    }

    if (typeof INTEGRATION_SECRET !== "string") {
      res.status(503).end("Service Unavailable");
      return;
    }

    const bodyBuffer = await getStream(req);
    const bodySignature = sha1(bodyBuffer, INTEGRATION_SECRET);
    if (bodySignature !== req.headers["x-vercel-signature"]) {
      res.status(403).end("Forbidden");
      return;
    }

    let body;
    try {
      body = JSON.parse(bodyBuffer);
    } catch {
      res.status(400).end("Bad request");
      return;
    }

    const { projects } = await api.get("v9/projects").json();
    await Promise.all(
      projects.map((project) =>
        api
          .post(
            `v1/projects/${project.id}/${body.type === "endOfBillingCycle" ? "unpause" : "pause"}`,
            { json: {} },
          )
          .json(),
      ),
    );

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).end("Internal Server Error");
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
