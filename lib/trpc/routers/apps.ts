import { z } from "zod";
import { createTRPCRouter, protectedProcedure, teamProcedure } from "../server";
import { apps, appMetrics } from "../../db/postgres/schema";
import { eq, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export const appsRouter = createTRPCRouter({
  // Get all apps for a team
  getAll: teamProcedure.query(async ({ ctx }) => {
    const teamApps = await ctx.db
      .select()
      .from(apps)
      .where(eq(apps.teamId, ctx.team.id))
      .orderBy(desc(apps.createdAt));

    return teamApps;
  }),

  // Get a specific app by ID
  getById: teamProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const app = await ctx.db
        .select()
        .from(apps)
        .where(and(eq(apps.id, input.id), eq(apps.teamId, ctx.team.id)))
        .limit(1);

      if (app.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "App not found",
        });
      }

      return app[0];
    }),

  // Create a new app (onboarding)
  create: teamProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required").max(255),
        description: z.string().optional(),
        githubRepo: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Generate API key
      const apiKey = `sk_live_${nanoid(32)}`;

      const newApp = await ctx.db
        .insert(apps)
        .values({
          name: input.name,
          description: input.description,
          githubRepo: input.githubRepo,
          apiKey,
          teamId: ctx.team.id,
          createdById: ctx.user!.id,
          status: "active",
        })
        .returning();

      return newApp[0];
    }),

  // Update an app
  update: teamProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        githubRepo: z.string().optional(),
        status: z.enum(["active", "inactive", "error"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Verify app belongs to team
      const existingApp = await ctx.db
        .select()
        .from(apps)
        .where(and(eq(apps.id, id), eq(apps.teamId, ctx.team.id)))
        .limit(1);

      if (existingApp.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "App not found",
        });
      }

      const updatedApp = await ctx.db
        .update(apps)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(apps.id, id))
        .returning();

      return updatedApp[0];
    }),

  // Delete an app
  delete: teamProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Verify app belongs to team
      const existingApp = await ctx.db
        .select()
        .from(apps)
        .where(and(eq(apps.id, input.id), eq(apps.teamId, ctx.team.id)))
        .limit(1);

      if (existingApp.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "App not found",
        });
      }

      await ctx.db.delete(apps).where(eq(apps.id, input.id));

      return { success: true };
    }),

  // Regenerate API key
  regenerateApiKey: teamProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Verify app belongs to team
      const existingApp = await ctx.db
        .select()
        .from(apps)
        .where(and(eq(apps.id, input.id), eq(apps.teamId, ctx.team.id)))
        .limit(1);

      if (existingApp.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "App not found",
        });
      }

      const newApiKey = `sk_live_${nanoid(32)}`;

      const updatedApp = await ctx.db
        .update(apps)
        .set({ apiKey: newApiKey, updatedAt: new Date() })
        .where(eq(apps.id, input.id))
        .returning();

      return updatedApp[0];
    }),

  // Get app metrics
  getMetrics: teamProcedure
    .input(
      z.object({
        appId: z.number(),
        days: z.number().default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify app belongs to team
      const app = await ctx.db
        .select()
        .from(apps)
        .where(and(eq(apps.id, input.appId), eq(apps.teamId, ctx.team.id)))
        .limit(1);

      if (app.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "App not found",
        });
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const metrics = await ctx.db
        .select()
        .from(appMetrics)
        .where(
          and(
            eq(appMetrics.appId, input.appId)
            // gte(appMetrics.date, startDate)
          )
        )
        .orderBy(desc(appMetrics.date));

      return metrics;
    }),
});
