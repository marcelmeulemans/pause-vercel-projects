import crypto from "node:crypto";
import got from "got";

const { VERCEL_TEAM_ID, VERCEL_TOKEN } = process.env;

export const api = got.extend({
  prefixUrl: "https://api.vercel.com",
  headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  searchParams: { teamId: VERCEL_TEAM_ID },
});

export function sha1(data, secret) {
  return crypto.createHmac("sha1", secret).update(data).digest("hex");
}
