import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  varchar,
  serial,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  avatarUrl: text("avatar_url"),
  githubId: varchar("github_id", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Teams/Organizations table
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Team memberships
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }).notNull().default("member"), // 'owner', 'admin', 'member'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Applications table
export const apps = pgTable(
  "apps",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    status: varchar("status", { length: 50 }).notNull().default("active"), // 'active', 'inactive', 'error'
    apiKey: varchar("api_key", { length: 255 }).notNull().unique(),
    githubRepo: varchar("github_repo", { length: 255 }),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    createdById: integer("created_by_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    teamIdIdx: index("apps_team_id_idx").on(table.teamId),
    apiKeyIdx: index("apps_api_key_idx").on(table.apiKey),
  })
);

// App metrics (aggregated data)
export const appMetrics = pgTable(
  "app_metrics",
  {
    id: serial("id").primaryKey(),
    appId: integer("app_id")
      .notNull()
      .references(() => apps.id, { onDelete: "cascade" }),
    date: timestamp("date").notNull(),
    requestsTotal: integer("requests_total").notNull().default(0),
    errorsTotal: integer("errors_total").notNull().default(0),
    avgResponseTime: integer("avg_response_time").notNull().default(0), // in milliseconds
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    appIdDateIdx: index("app_metrics_app_id_date_idx").on(
      table.appId,
      table.date
    ),
  })
);

// GitHub integrations
export const githubIntegrations = pgTable(
  "github_integrations",
  {
    id: serial("id").primaryKey(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    installationId: varchar("installation_id", { length: 255 }).notNull(),
    repos: jsonb("repos").$type<string[]>().notNull().default([]),
    webhookSecret: varchar("webhook_secret", { length: 255 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    teamIdIdx: index("github_integrations_team_id_idx").on(table.teamId),
  })
);

// API tokens for authentication
export const apiTokens = pgTable(
  "api_tokens",
  {
    id: serial("id").primaryKey(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    appId: integer("app_id")
      .notNull()
      .references(() => apps.id, { onDelete: "cascade" }),
    createdById: integer("created_by_id")
      .notNull()
      .references(() => users.id),
    expiresAt: timestamp("expires_at"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    tokenIdx: index("api_tokens_token_idx").on(table.token),
    appIdIdx: index("api_tokens_app_id_idx").on(table.appId),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedTeams: many(teams),
  teamMemberships: many(teamMembers),
  createdApps: many(apps),
  createdTokens: many(apiTokens),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, {
    fields: [teams.ownerId],
    references: [users.id],
  }),
  members: many(teamMembers),
  apps: many(apps),
  githubIntegration: many(githubIntegrations),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const appsRelations = relations(apps, ({ one, many }) => ({
  team: one(teams, {
    fields: [apps.teamId],
    references: [teams.id],
  }),
  createdBy: one(users, {
    fields: [apps.createdById],
    references: [users.id],
  }),
  metrics: many(appMetrics),
  tokens: many(apiTokens),
}));

export const appMetricsRelations = relations(appMetrics, ({ one }) => ({
  app: one(apps, {
    fields: [appMetrics.appId],
    references: [apps.id],
  }),
}));

export const githubIntegrationsRelations = relations(
  githubIntegrations,
  ({ one }) => ({
    team: one(teams, {
      fields: [githubIntegrations.teamId],
      references: [teams.id],
    }),
  })
);

export const apiTokensRelations = relations(apiTokens, ({ one }) => ({
  app: one(apps, {
    fields: [apiTokens.appId],
    references: [apps.id],
  }),
  createdBy: one(users, {
    fields: [apiTokens.createdById],
    references: [users.id],
  }),
}));
