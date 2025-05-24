import { initTRPC, TRPCError } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { db } from "../db/postgres/connection";
import { eq } from "drizzle-orm";
import {
  apps,
  users,
  teams,
  teamMembers,
  apiTokens,
} from "../db/postgres/schema";

interface CreateContextOptions {
  req?: {
    headers: {
      authorization?: string;
      "x-api-key"?: string;
    };
  };
}

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  const { req } = opts;

  // Get API key or auth token from headers
  const apiKey = req.headers.get("x-api-key");
  const authToken = req.headers.get("authorization")?.replace("Bearer ", "");

  let user = null;
  let app = null;
  let team = null;

  // Authenticate using API key (for SDK integration)
  if (apiKey) {
    const tokenResult = await db
      .select({
        app: apps,
        user: users,
        team: teams,
      })
      .from(apiTokens)
      .innerJoin(apps, eq(apiTokens.appId, apps.id))
      .innerJoin(users, eq(apiTokens.createdById, users.id))
      .innerJoin(teams, eq(apps.teamId, teams.id))
      .where(eq(apiTokens.token, apiKey))
      .limit(1);

    if (tokenResult.length > 0) {
      app = tokenResult[0].app;
      user = tokenResult[0].user;
      team = tokenResult[0].team;
    }
  }

  // TODO: Add session-based authentication for web interface
  // This would integrate with NextAuth.js or similar

  return {
    db,
    user,
    app,
    team,
    apiKey: apiKey || "",
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource",
      });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  })
);

// App-scoped procedure that requires valid API key
export const appProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!ctx.app || !ctx.apiKey) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Valid API key required",
      });
    }
    return next({
      ctx: {
        ...ctx,
        app: ctx.app,
        apiKey: ctx.apiKey,
      },
    });
  })
);

// Team-scoped procedure
export const teamProcedure = protectedProcedure.use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.team) {
      // Try to get user's default team
      const userTeams = await ctx.db
        .select({ team: teams })
        .from(teamMembers)
        .innerJoin(teams, eq(teamMembers.teamId, teams.id))
        .where(eq(teamMembers.userId, ctx.user!.id))
        .limit(1);

      if (userTeams.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be a member of a team to access this resource",
        });
      }

      ctx.team = userTeams[0].team;
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
        team: ctx.team,
      },
    });
  })
);
