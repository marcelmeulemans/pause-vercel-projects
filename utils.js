import crypto from "node:crypto";
import got from "got";
import getStream from "get-stream";

const { INTEGRATION_SECRET, VERCEL_TEAM_ID, VERCEL_TOKEN } = process.env;

const api = got.extend({
  prefixUrl: "https://api.vercel.com",
  headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  searchParams: { teamId: VERCEL_TEAM_ID },
});

export function sha1(data, secret) {
  return crypto.createHmac("sha1", secret).update(data).digest("hex");
}

export function makeHandler(handler) {
  return async (req, res) => {
    try {
      if (req.method !== "POST") {
        res.status(404).end("Not Found");
        return;
      }

      if (typeof INTEGRATION_SECRET !== "string") {
        res.status(503).end("Service Unavailable");
        return;
      }

      const body = await getStream(req);
      const bodySignature = sha1(body, INTEGRATION_SECRET);
      if (bodySignature !== req.headers["x-vercel-signature"]) {
        res.status(403).end("Forbidden");
        return;
      }

      const result = await handler({ api });
      res
        .status(200)
        .json(result ?? {})
        .end();
    } catch (error) {
      console.error(error);
      res.status(500).end("Internal Server Error");
    }
  };
}
