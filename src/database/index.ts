import Database from "better-sqlite3";
import { PostgresDatabaseAdapter } from "@ai16z/adapter-postgres";
import { SqliteDatabaseAdapter } from "@ai16z/adapter-sqlite";
import path from "path";

/**
 * Initializes and returns a database adapter based on the environment configuration
 */
export function initializeDatabase(dataDir: string) {
  // Check if a PostgreSQL URL is provided in the environment variables
  if (process.env.POSTGRES_URL) {
    // Initialize and return a PostgreSQL database adapter
    const db = new PostgresDatabaseAdapter({
      connectionString: process.env.POSTGRES_URL,
    });
    return db;
  } else {
    // If no PostgreSQL URL is provided, use SQLite
    // Determine the SQLite database file path
    const filePath =
      process.env.SQLITE_FILE ?? path.resolve(dataDir, "db.sqlite");
    // Note: ":memory:" can be used for in-memory SQLite database

    // Initialize and return a SQLite database adapter
    const db = new SqliteDatabaseAdapter(new Database(filePath));
    return db;
  }
}
