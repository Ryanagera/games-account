import "dotenv/config";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Set up WebSocket for Node.js environments
neonConfig.webSocketConstructor = ws;

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }
  
  console.log("Initializing Prisma with Neon adapter.");
  console.log("URL defined:", !!url, "Length:", url.length);

  try {
    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaNeon(pool as any);
    console.log("Neon adapter created successfully.");
    return new PrismaClient({ adapter });
  } catch (err) {
    console.error("Failed to initialize Prisma Client:", err);
    throw err;
  }
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
