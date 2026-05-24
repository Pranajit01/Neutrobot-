import { createClient } from 'redis';

let isRedisConnected = false;
const memoryCache = new Map<string, { val: string; expiry: number }>();

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  // Disable automatic reconnection spam
  socket: {
    reconnectStrategy: false
  }
});

client.on('error', (err) => {
  // Silent catch to prevent crash
});

export async function connectRedis() {
  // Try to connect in the background so we do not block Express server startup
  client.connect()
    .then(() => {
      isRedisConnected = true;
      console.log('Connected to Redis successfully');
    })
    .catch((err) => {
      console.warn('Redis connection failed, falling back to in-memory cache.');
      isRedisConnected = false;
    });
}

export const redisClient = {
  get: async (key: string): Promise<string | null> => {
    if (isRedisConnected) {
      try {
        return await client.get(key);
      } catch (err) {
        console.warn('Redis GET failed:', err);
      }
    }
    const item = memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      memoryCache.delete(key);
      return null;
    }
    return item.val;
  },
  setEx: async (key: string, seconds: number, value: string): Promise<void> => {
    if (isRedisConnected) {
      try {
        await client.setEx(key, seconds, value);
        return;
      } catch (err) {
        console.warn('Redis SETEX failed:', err);
      }
    }
    memoryCache.set(key, {
      val: value,
      expiry: Date.now() + seconds * 1000
    });
  },
  del: async (key: string): Promise<void> => {
    if (isRedisConnected) {
      try {
        await client.del(key);
        return;
      } catch (err) {
        console.warn('Redis DEL failed:', err);
      }
    }
    memoryCache.delete(key);
  }
};
