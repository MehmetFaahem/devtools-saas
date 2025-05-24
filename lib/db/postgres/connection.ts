import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../../env";
import * as schema from "./schema";

declare global {
  var __pgPool: Pool | undefined;
}

let pool: Pool;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: env.DATABASE_URL,
  });
} else {
  if (!global.__pgPool) {
    global.__pgPool = new Pool({
      connectionString: env.DATABASE_URL,
    });
  }
  pool = global.__pgPool;
}

export const db = drizzle(pool, { schema });

export type Database = typeof db;
