#!/usr/bin/env node
/**
 * Applies supabase/migrations/*.sql when DATABASE_URL is set.
 * Get it from Supabase Dashboard → Project Settings → Database → Connection string (URI).
 *
 * Usage: DATABASE_URL="postgresql://..." npm run db:migrate
 */
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, "../supabase/migrations");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL. Add your Supabase Postgres connection string and retry."
  );
  process.exit(1);
}

const sql = postgres(databaseUrl, { ssl: "require", max: 1 });

const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

try {
  for (const file of files) {
    const query = readFileSync(join(migrationsDir, file), "utf8");
    console.log(`Applying ${file}...`);
    await sql.unsafe(query);
    console.log(`✓ ${file}`);
  }
  console.log("Migration complete.");
} catch (err) {
  console.error("Migration failed:", err);
  process.exit(1);
} finally {
  await sql.end();
}
