import { z } from "zod";
import { createTRPCRouter, appProcedure, teamProcedure } from "../server";
import {
  errorLogsCollection,
  performanceLogsCollection,
  type ErrorLogDocument,
  type PerformanceLogDocument,
} from "../../db/mongodb/connection";
import { apps } from "../../db/postgres/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const logsRouter = createTRPCRouter({
  // Log an error (SDK endpoint)
  logError: appProcedure
    .input(
      z.object({
        message: z.string().min(1),
        stackTrace: z.string().optional(),
        source: z.enum(["frontend", "backend"]),
        severity: z.enum(["info", "warning", "error", "critical"]),
        metadata: z.record(z.any()).optional(),
        timestamp: z.date().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const errorLog: ErrorLogDocument = {
        appId: ctx.app.id.toString(),
        message: input.message,
        stackTrace: input.stackTrace,
        source: input.source,
        severity: input.severity,
        metadata: input.metadata || {},
        timestamp: input.timestamp || new Date(),
        resolved: false,
        tags: input.tags || [],
      };

      const result = await errorLogsCollection().insertOne(errorLog);

      return {
        id: result.insertedId.toString(),
        success: true,
      };
    }),

  // Log performance data
  logPerformance: appProcedure
    .input(
      z.object({
        endpoint: z.string(),
        method: z.string(),
        responseTime: z.number(),
        statusCode: z.number(),
        metadata: z.record(z.any()).optional(),
        timestamp: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const perfLog: PerformanceLogDocument = {
        appId: ctx.app.id.toString(),
        endpoint: input.endpoint,
        method: input.method,
        responseTime: input.responseTime,
        statusCode: input.statusCode,
        timestamp: input.timestamp || new Date(),
        metadata: input.metadata || {},
      };

      const result = await performanceLogsCollection().insertOne(perfLog);

      return {
        id: result.insertedId.toString(),
        success: true,
      };
    }),

  // Get error logs for dashboard
  getErrorLogs: teamProcedure
    .input(
      z.object({
        appId: z.number().optional(),
        severity: z.enum(["info", "warning", "error", "critical"]).optional(),
        source: z.enum(["frontend", "backend"]).optional(),
        resolved: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Build filter
      const filter: any = {};

      // If appId specified, verify it belongs to team
      if (input.appId) {
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

      if (input.severity) filter.severity = input.severity;
      if (input.source) filter.source = input.source;
      if (input.resolved !== undefined) filter.resolved = input.resolved;

      if (input.startDate || input.endDate) {
        filter.timestamp = {};
        if (input.startDate) filter.timestamp.$gte = input.startDate;
        if (input.endDate) filter.timestamp.$lte = input.endDate;
      }

      const logs = await errorLogsCollection()
        .find(filter)
        .sort({ timestamp: -1 })
        .skip(input.offset)
        .limit(input.limit)
        .toArray();

      const total = await errorLogsCollection().countDocuments(filter);

      return {
        logs: logs.map((log) => ({
          ...log,
          id: log._id?.toString(),
        })),
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  // Get performance logs
  getPerformanceLogs: teamProcedure
    .input(
      z.object({
        appId: z.number().optional(),
        endpoint: z.string().optional(),
        method: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const filter: any = {};

      // If appId specified, verify it belongs to team
      if (input.appId) {
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

      if (input.endpoint)
        filter.endpoint = { $regex: input.endpoint, $options: "i" };
      if (input.method) filter.method = input.method;

      if (input.startDate || input.endDate) {
        filter.timestamp = {};
        if (input.startDate) filter.timestamp.$gte = input.startDate;
        if (input.endDate) filter.timestamp.$lte = input.endDate;
      }

      const logs = await performanceLogsCollection()
        .find(filter)
        .sort({ timestamp: -1 })
        .skip(input.offset)
        .limit(input.limit)
        .toArray();

      const total = await performanceLogsCollection().countDocuments(filter);

      return {
        logs: logs.map((log) => ({
          ...log,
          id: log._id?.toString(),
        })),
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  // Resolve an error
  resolveError: teamProcedure
    .input(
      z.object({
        errorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify error belongs to team's apps
      const error = await errorLogsCollection().findOne({
        _id: input.errorId as any,
      });

      if (!error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Error log not found",
        });
      }

      // Verify app belongs to team
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

      await errorLogsCollection().updateOne(
        { _id: input.errorId as any },
        {
          $set: {
            resolved: true,
            resolvedAt: new Date(),
            resolvedBy: ctx.user!.id.toString(),
          },
        }
      );

      return { success: true };
    }),

  // Get error statistics
  getErrorStats: teamProcedure
    .input(
      z.object({
        appId: z.number().optional(),
        days: z.number().default(30),
      })
    )
    .query(async ({ ctx, input }) => {
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

      const [totalErrors, bySeverity, bySource, byDay] = await Promise.all([
        // Total errors
        errorLogsCollection().countDocuments(filter),

        // By severity
        errorLogsCollection()
          .aggregate([
            { $match: filter },
            { $group: { _id: "$severity", count: { $sum: 1 } } },
          ])
          .toArray(),

        // By source
        errorLogsCollection()
          .aggregate([
            { $match: filter },
            { $group: { _id: "$source", count: { $sum: 1 } } },
          ])
          .toArray(),

        // By day
        errorLogsCollection()
          .aggregate([
            { $match: filter },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ])
          .toArray(),
      ]);

      return {
        totalErrors,
        bySeverity: bySeverity.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        bySource: bySource.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        byDay: byDay.map((item) => ({
          date: item._id,
          count: item.count,
        })),
      };
    }),
});
