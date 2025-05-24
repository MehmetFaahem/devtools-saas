import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),

  // GitHub
  GITHUB_WEBHOOK_SECRET: z.string().min(1, "GITHUB_WEBHOOK_SECRET is required"),
  GITHUB_TOKEN: z.string().min(1, "GITHUB_TOKEN is required"),

  // App
  APP_URL: z.string().url("APP_URL must be a valid URL"),
  WEBHOOK_URL: z.string().url("WEBHOOK_URL must be a valid URL"),

  // Next.js
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
});

// Default values for development
const defaultEnv = {
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres:password@localhost:5432/devtools_saas",
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/devtools_saas_logs",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "sk-development-key",
  GITHUB_WEBHOOK_SECRET:
    process.env.GITHUB_WEBHOOK_SECRET || "development-secret",
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || "ghp_development-token",
  APP_URL: process.env.APP_URL || "http://localhost:3000",
  WEBHOOK_URL:
    process.env.WEBHOOK_URL || "http://localhost:3000/api/webhooks/github",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "development-secret-key",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
};

export const env = envSchema.parse(defaultEnv);

export type Env = z.infer<typeof envSchema>;
