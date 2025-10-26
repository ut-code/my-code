import { getAuthServer } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler({
  handler: async (req) =>
    (await getAuthServer(await getPrismaClient())).handler(req),
});
