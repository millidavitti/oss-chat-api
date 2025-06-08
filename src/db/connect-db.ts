import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
	connectionString: process.env.DATABASE_URL!,
});
// You can specify any property from the node-postgres connection options
export const db = drizzle({
	client: pool,
});
