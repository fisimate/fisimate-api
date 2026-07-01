import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrations need a direct/session connection (not a transaction-mode pooler
// like Supabase's pgbouncer on :6543). DIRECT_URL is optional and falls back
// to DATABASE_URL for setups without a pooler (e.g. local Postgres).
const migrationUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node prisma/seeders/index.js",
  },
  datasource: {
    url: migrationUrl,
  },
});
