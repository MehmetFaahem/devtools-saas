import { z } from "zod";
import { createTRPCRouter, teamProcedure } from "../server";
import {
  errorLogsCollection,
  githubEventsCollection,
} from "../../db/mongodb/connection";
import { apps } from "../../db/postgres/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { openaiService } from "../../services/openai";

export const aiRouter = createTRPCRouter({
  // Generate bug report summary from GitHub issue
  generateBugReport: teamProcedure
    .input(
      z.object({
        issueTitle: z.string(),
        issueBody: z.string(),
        repository: z.string(),
        includeErrorLogs: z.boolean().default(true),
        appId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let errorLogs: any[] = [];

      if (input.includeErrorLogs) {
        // Get recent error logs for context
        const filter: any = {
          timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
        };

        if (input.appId) {
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

          filter.appId = input.appId.toString();
        } else {
          // Get all apps for this team
          const teamApps = await ctx.db
            .select({ id: apps.id })
            .from(apps)
            .where(eq(apps.teamId, ctx.team.id));

          filter.appId = { $in: teamApps.map((app) => app.id.toString()) };
        }

        const recentErrors = await errorLogsCollection()
          .find(filter)
          .sort({ timestamp: -1 })
          .limit(10)
          .toArray();

        errorLogs = recentErrors.map((error) => ({
          message: error.message,
          stackTrace: error.stackTrace,
          source: error.source,
          severity: error.severity,
          timestamp: error.timestamp,
        }));
      }

      const summary = await openaiService.generateBugReportSummary({
        issueTitle: input.issueTitle,
        issueBody: input.issueBody,
        repository: input.repository,
        errorLogs,
      });

      if (!summary) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate bug report summary",
        });
      }

      return { summary };
    }),

  // Analyze error patterns
  analyzeErrorPatterns: teamProcedure
    .input(
      z.object({
        appId: z.number().optional(),
        days: z.number().default(7),
        severity: z.enum(["info", "warning", "error", "critical"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const filter: any = {
        timestamp: { $gte: startDate },
      };

      if (input.appId) {
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

        filter.appId = input.appId.toString();
      } else {
        // Get all apps for this team
        const teamApps = await ctx.db
          .select({ id: apps.id })
          .from(apps)
          .where(eq(apps.teamId, ctx.team.id));

        filter.appId = { $in: teamApps.map((app) => app.id.toString()) };
      }

      if (input.severity) {
        filter.severity = input.severity;
      }

      const errorLogs = await errorLogsCollection()
        .find(filter)
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray();

      if (errorLogs.length === 0) {
        return { analysis: "No error logs found for the specified criteria." };
      }

      const errorData = errorLogs.map((error) => ({
        message: error.message,
        stackTrace: error.stackTrace,
        source: error.source,
        severity: error.severity,
        timestamp: error.timestamp,
      }));

      const analysis = await openaiService.analyzeErrorPattern(errorData);

      if (!analysis) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to analyze error patterns",
        });
      }

      return { analysis };
    }),

  // Suggest error resolution
  suggestResolution: teamProcedure
    .input(
      z.object({
        errorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get the error log
      const error = await errorLogsCollection().findOne({
        _id: input.errorId as any,
      });

      if (!error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Error log not found",
        });
      }

      // Verify error belongs to team's apps
      const app = await ctx.db
        .select()
        .from(apps)
        .where(
          and(eq(apps.id, parseInt(error.appId)), eq(apps.teamId, ctx.team.id))
        )
        .limit(1);

      if (app.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }

      const suggestion = await openaiService.suggestErrorResolution(
        error.message,
        error.stackTrace,
        error.metadata
      );

      if (!suggestion) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate error resolution suggestion",
        });
      }

      return { suggestion };
    }),

  // Process GitHub event with AI
  processGitHubEvent: teamProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get the GitHub event
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

      if (event.processed) {
        return { summary: event.aiSummary || "Already processed" };
      }

      // Generate AI summary based on event type
      let summary: string | null = null;

      if (event.event === "issues" && event.payload?.issue) {
        // Get related error logs for this repository
        const recentErrors = await errorLogsCollection()
          .find({
            timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
          })
          .sort({ timestamp: -1 })
          .limit(5)
          .toArray();

        const errorLogs = recentErrors.map((error) => ({
          message: error.message,
          stackTrace: error.stackTrace,
          source: error.source,
          severity: error.severity,
          timestamp: error.timestamp,
        }));

        summary = await openaiService.generateBugReportSummary({
          issueTitle: event.payload.issue.title,
          issueBody: event.payload.issue.body,
          repository: event.repository,
          errorLogs,
        });
      } else if (event.event === "push" && event.payload?.commits) {
        // Analyze commit messages
        const commitMessages = event.payload.commits.map(
          (commit: any) => commit.message
        );

        summary = await openaiService.generateBugReportSummary({
          commitMessages,
          repository: event.repository,
        });
      }

      if (summary) {
        // Update the event with AI summary
        await githubEventsCollection().updateOne(
          { _id: input.eventId as any },
          {
            $set: {
              aiSummary: summary,
              processed: true,
              processedAt: new Date(),
            },
          }
        );
      }

      return {
        summary: summary || "Unable to generate summary for this event type",
      };
    }),
});
