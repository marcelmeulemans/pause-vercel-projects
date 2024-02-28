import { makeHandler } from "../utils.js";

const handler = makeHandler(async ({ api }) => {
  const { projects } = await api.get("v9/projects").json();
  await Promise.all(
    projects.map((project) =>
      api.post(`v1/projects/${project.id}/pause`, { json: {} }).json(),
    ),
  );
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
