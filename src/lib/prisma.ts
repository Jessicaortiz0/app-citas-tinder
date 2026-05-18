import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL!;

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaPg({ connectionString });
  prismaInstance = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    const adapter = new PrismaPg({ connectionString });
    global.prisma = new PrismaClient({ adapter });
  }
  prismaInstance = global.prisma;
}

export const prisma = prismaInstance;