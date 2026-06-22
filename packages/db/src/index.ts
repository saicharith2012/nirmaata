import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const PrismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

type PrismaSingletonType = ReturnType<typeof PrismaClientSingleton>;

const globalForPrisma = global as unknown as {
  prisma: PrismaSingletonType | undefined;
};

const prisma = globalForPrisma.prisma ?? PrismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
