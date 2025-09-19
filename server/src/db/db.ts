import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";

dotenv.config();

const db_url = process.env.DATABASE_URL as string;

export const db = drizzle(db_url);