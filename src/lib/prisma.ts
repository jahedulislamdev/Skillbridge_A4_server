import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../../generated/prisma/client";
import appConfig from "../config/index.js";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${appConfig.db_url}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
