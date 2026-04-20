console.log("DATABASE_URL:", process.env.DATABASE_URL);
import { DATABASE_URL } from "../config/env.config.js";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: DATABASE_URL
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter
});

export default prisma;