import { z } from "zod";
import { createTRPCRouter, teamProcedure } from "../server";
import { githubIntegrations } from "../../db/postgres/schema";
import {
  githubEventsCollection,
  type GitHubEventDocument,
} from "../../db/mongodb/connection";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { env } from "../../env";

export const githubRouter = createTRPCRouter({
  // Get GitHub integration for team
  getIntegration: teamProcedure.query(async ({ ctx }) => {
    const integration = await ctx.db
      .select()
      .from(githubIntegrations)
      .where(eq(githubIntegrations.teamId, ctx.team.id))
      .limit(1);

    return integration[0] || null;
  }),

  // Create or update GitHub integration
  setupIntegration: teamProcedure
    .input(
      z.object({
        installationId: z.string(),
        repos: z.array(z.string()),
        webhookSecret: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const webhookSecret = input.webhookSecret || env.GITHUB_WEBHOOK_SECRET;

      // Check if integration already exists
      const existing = await ctx.db
        .select()
        .from(githubIntegrations)
        .where(eq(githubIntegrations.teamId, ctx.team.id))
        .limit(1);

      if (existing.length > 0) {
        // Update existing integration
        const updated = await ctx.db
          .update(githubIntegrations)
          .set({
            installationId: input.installationId,
            repos: input.repos,
            webhookSecret,
            isActive: true,
            updatedAt: new Date(),
          })
          .where(eq(githubIntegrations.id, existing[0].id))
          .returning();

        return updated[0];
      } else {
        // Create new integration
        const created = await ctx.db
          .insert(githubIntegrations)
          .values({
            teamId: ctx.team.id,
            installationId: input.installationId,
            repos: input.repos,
            webhookSecret,
            isActive: true,
          })
          .returning();

        return created[0];
      }
    }),

  // Disable GitHub integration
  disableIntegration: teamProcedure.mutation(async ({ ctx }) => {
    const updated = await ctx.db
      .update(githubIntegrations)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(githubIntegrations.teamId, ctx.team.id))
      .returning();

    if (updated.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "GitHub integration not found",
      });
    }

    return updated[0];
  }),

  // Get GitHub events/issues
  getEvents: teamProcedure
    .input(
      z.object({
        repository: z.string().optional(),
        event: z.string().optional(),
        processed: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify team has GitHub integration
      const integration = await ctx.db
        .select()
        .from(githubIntegrations)
        .where(eq(githubIntegrations.teamId, ctx.team.id))
        .limit(1);

      if (integration.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "GitHub integration not found",
        });
      }

      const filter: any = {
        teamId: ctx.team.id.toString(),
      };

      if (input.repository) {
        filter.repository = { $regex: input.repository, $options: "i" };
      }
      if (input.event) filter.event = input.event;
      if (input.processed !== undefined) filter.processed = input.processed;

      if (input.startDate || input.endDate) {
        filter.timestamp = {};
        if (input.startDate) filter.timestamp.$gte = input.startDate;
        if (input.endDate) filter.timestamp.$lte = input.endDate;
      }

      const events = await githubEventsCollection()
        .find(filter)
        .sort({ timestamp: -1 })
        .skip(input.offset)
        .limit(input.limit)
        .toArray();

      const total = await githubEventsCollection().countDocuments(filter);

      return {
        events: events.map((event) => ({
          ...event,
          id: event._id?.toString(),
        })),
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  // Get GitHub issues (mock for now - would integrate with GitHub API)
  getIssues: teamProcedure
    .input(
      z.object({
        repository: z.string().optional(),
        state: z.enum(["open", "closed", "all"]).default("open"),
        labels: z.array(z.string()).optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify team has GitHub integration
      const integration = await ctx.db
        .select()
        .from(githubIntegrations)
        .where(eq(githubIntegrations.teamId, ctx.team.id))
        .limit(1);

      if (integration.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "GitHub integration not found",
        });
      }

      // TODO: Implement actual GitHub API integration
      // For now, return filtered events that are issues
      const filter: any = {
        teamId: ctx.team.id.toString(),
        event: "issues",
      };

      if (input.repository) {
        filter.repository = { $regex: input.repository, $options: "i" };
      }

      const issues = await githubEventsCollection()
        .find(filter)
        .sort({ timestamp: -1 })
        .limit(input.limit)
        .toArray();

      return issues.map((issue) => ({
        id: issue._id?.toString(),
        number: issue.payload?.issue?.number || 0,
        title: issue.payload?.issue?.title || "Unknown Issue",
        body: issue.payload?.issue?.body || "",
        state: issue.payload?.issue?.state || "open",
        url: issue.payload?.issue?.html_url || "",
        createdAt: new Date(
          issue.payload?.issue?.created_at || issue.timestamp
        ),
        updatedAt: new Date(
          issue.payload?.issue?.updated_at || issue.timestamp
        ),
        user: {
          login: issue.payload?.issue?.user?.login || "unknown",
          avatarUrl: issue.payload?.issue?.user?.avatar_url || "",
        },
        labels: issue.payload?.issue?.labels || [],
        repository: issue.repository,
        aiSummary: issue.aiSummary,
      }));
    }),

  // Mark event as processed
  markEventProcessed: teamProcedure
    .input(
      z.object({
        eventId: z.string(),
        aiSummary: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify event belongs to team
      const event = await githubEventsCollection().findOne({
        _id: input.eventId as any,
        teamId: ctx.team.id.toString(),
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "GitHub event not found",
        });
      }

      await githubEventsCollection().updateOne(
        { _id: input.eventId as any },
        {
          $set: {
            processed: true,
            processedAt: new Date(),
            ...(input.aiSummary && { aiSummary: input.aiSummary }),
          },
        }
      );

      return { success: true };
    }),

  // Get repository statistics
  getRepoStats: teamProcedure
    .input(
      z.object({
        days: z.number().default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const filter = {
        teamId: ctx.team.id.toString(),
        timestamp: { $gte: startDate },
      };

      const [totalEvents, byEvent, byRepo] = await Promise.all([
        // Total events
        githubEventsCollection().countDocuments(filter),

        // By event type
        githubEventsCollection()
          .aggregate([
            { $match: filter },
            { $group: { _id: "$event", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ])
          .toArray(),

        // By repository
        githubEventsCollection()
          .aggregate([
            { $match: filter },
            { $group: { _id: "$repository", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ])
          .toArray(),
      ]);

      return {
        totalEvents,
        byEvent: byEvent.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        byRepo: byRepo.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
      };
    }),
});
