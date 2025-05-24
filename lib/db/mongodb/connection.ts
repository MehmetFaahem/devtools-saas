import { MongoClient, Db, Collection } from "mongodb";
import { env } from "../../env";

declare global {
  var __mongoClient: MongoClient | undefined;
}

let client: MongoClient;
let db: Db;

if (process.env.NODE_ENV === "production") {
  client = new MongoClient(env.MONGODB_URI);
  db = client.db();
} else {
  if (!global.__mongoClient) {
    global.__mongoClient = new MongoClient(env.MONGODB_URI);
  }
  client = global.__mongoClient;
  db = client.db();
}

// Connect to MongoDB
async function connectMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Initialize connection
connectMongo().catch(console.error);

// Collections
export const errorLogsCollection = (): Collection<ErrorLogDocument> =>
  db.collection<ErrorLogDocument>("error_logs");

export const performanceLogsCollection =
  (): Collection<PerformanceLogDocument> =>
    db.collection<PerformanceLogDocument>("performance_logs");

export const apiRequestsCollection = (): Collection<ApiRequestDocument> =>
  db.collection<ApiRequestDocument>("api_requests");

export const githubEventsCollection = (): Collection<GitHubEventDocument> =>
  db.collection<GitHubEventDocument>("github_events");

// Types for MongoDB documents
export interface ErrorLogDocument {
  _id?: string;
  appId: string;
  message: string;
  stackTrace?: string;
  source: "frontend" | "backend";
  severity: "info" | "warning" | "error" | "critical";
  metadata: {
    browser?: string;
    os?: string;
    userId?: string;
    url?: string;
    endpoint?: string;
    method?: string;
    userAgent?: string;
    ip?: string;
    [key: string]: any;
  };
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  tags?: string[];
}

export interface PerformanceLogDocument {
  _id?: string;
  appId: string;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  metadata: {
    userId?: string;
    userAgent?: string;
    ip?: string;
    queryParams?: Record<string, any>;
    bodySize?: number;
    responseSize?: number;
    [key: string]: any;
  };
}

export interface ApiRequestDocument {
  _id?: string;
  appId: string;
  apiKey: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  ip: string;
  userAgent?: string;
  requestSize?: number;
  responseSize?: number;
  metadata?: Record<string, any>;
}

export interface GitHubEventDocument {
  _id?: string;
  teamId: string;
  event: string;
  repository: string;
  action?: string;
  payload: Record<string, any>;
  timestamp: Date;
  processed: boolean;
  processedAt?: Date;
  aiSummary?: string;
}

export { client as mongoClient, db as mongoDB };
