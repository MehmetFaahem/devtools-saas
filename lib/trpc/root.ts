import { createTRPCRouter } from "./server";
import { appsRouter } from "./routers/apps";
import { logsRouter } from "./routers/logs";
import { githubRouter } from "./routers/github";
import { aiRouter } from "./routers/ai";

export const appRouter = createTRPCRouter({
  apps: appsRouter,
  logs: logsRouter,
  github: githubRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
