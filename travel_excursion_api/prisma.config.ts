import { defineConfig } from "prisma/config";
import * as dotenvSafe from "dotenv-safe";

dotenvSafe.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
