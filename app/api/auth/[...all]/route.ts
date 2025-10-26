import { getAuthServer } from "@/lib/auth";
import { getDrizzle } from "@/lib/drizzle";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler({
  handler: async (req) =>
    (await getAuthServer(await getDrizzle())).handler(req),
});
