import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

let prismaInstance: any = null;
try {
  // Catch any Prisma 7 instantiation errors (e.g. missing connection adapters/options)
  prismaInstance = new PrismaClient();
} catch (err) {
  console.warn('Could not instantiate PrismaClient. Database operations will fall back to memory.');
}

export const prisma = prismaInstance;

// In-memory database fallbacks
const memUsers = new Map<string, any>(); // id -> user
const memUsersByEmail = new Map<string, any>(); // email -> user
const memFoodLogs: any[] = [];

let isDbConnected: boolean | null = null;

async function checkDbConnection() {
  if (isDbConnected !== null) return isDbConnected;
  if (!prismaInstance) {
    isDbConnected = false;
    return false;
  }
  try {
    await prismaInstance.$connect();
    isDbConnected = true;
    console.log('Database connected successfully via Prisma');
  } catch (err) {
    console.warn('Prisma PostgreSQL connection failed. Falling back to in-memory store.');
    isDbConnected = false;
  }
  return isDbConnected;
}

export const db = {
  findUserByEmail: async (email: string) => {
    const usePrisma = await checkDbConnection();
    if (usePrisma) {
      try {
        return await prismaInstance.user.findUnique({ where: { email } });
      } catch (err) {
        console.warn('Prisma query findUserByEmail failed, falling back to memory:', err);
      }
    }
    return memUsersByEmail.get(email) || null;
  },

  createUser: async (data: { email: string; password: string; name?: string }) => {
    const usePrisma = await checkDbConnection();
    if (usePrisma) {
      try {
        return await prismaInstance.user.create({ data });
      } catch (err) {
        console.warn('Prisma createUser failed, falling back to memory:', err);
      }
    }
    const newUser = {
      id: Math.random().toString(36).substring(2, 11),
      email: data.email,
      password: data.password,
      name: data.name || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memUsers.set(newUser.id, newUser);
    memUsersByEmail.set(newUser.email, newUser);
    return newUser;
  },

  findUserById: async (id: string) => {
    const usePrisma = await checkDbConnection();
    if (usePrisma) {
      try {
        return await prismaInstance.user.findUnique({ where: { id } });
      } catch (err) {
        console.warn('Prisma findUserById failed, falling back to memory:', err);
      }
    }
    return memUsers.get(id) || null;
  },

  updateUser: async (id: string, data: { name: string }) => {
    const usePrisma = await checkDbConnection();
    if (usePrisma) {
      try {
        return await prismaInstance.user.update({ where: { id }, data });
      } catch (err) {
        console.warn('Prisma updateUser failed, falling back to memory:', err);
      }
    }
    const user = memUsers.get(id);
    if (!user) throw new Error('User not found');
    user.name = data.name;
    user.updatedAt = new Date();
    memUsers.set(id, user);
    memUsersByEmail.set(user.email, user);
    return user;
  },

  createFoodLog: async (data: {
    userId: string;
    query: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    deficiencies: string[];
    recommendations: string[];
  }) => {
    const usePrisma = await checkDbConnection();
    if (usePrisma) {
      try {
        return await prismaInstance.foodLog.create({ data });
      } catch (err) {
        console.warn('Prisma createFoodLog failed, falling back to memory:', err);
      }
    }
    const newLog = {
      id: Math.random().toString(36).substring(2, 11),
      ...data,
      createdAt: new Date()
    };
    memFoodLogs.push(newLog);
    return newLog;
  },

  findFoodLogsByUserId: async (userId: string) => {
    const usePrisma = await checkDbConnection();
    if (usePrisma) {
      try {
        return await prismaInstance.foodLog.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        });
      } catch (err) {
        console.warn('Prisma findFoodLogsByUserId failed, falling back to memory:', err);
      }
    }
    return memFoodLogs
      .filter((log) => log.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  findFoodLogsByUserIdAndDate: async (userId: string, startDate: Date, endDate: Date) => {
    const usePrisma = await checkDbConnection();
    if (usePrisma) {
      try {
        return await prismaInstance.foodLog.findMany({
          where: {
            userId,
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          }
        });
      } catch (err) {
        console.warn('Prisma findFoodLogsByUserIdAndDate failed, falling back to memory:', err);
      }
    }
    return memFoodLogs.filter(
      (log) =>
        log.userId === userId &&
        log.createdAt.getTime() >= startDate.getTime() &&
        log.createdAt.getTime() <= endDate.getTime()
    );
  }
};
export default db;
