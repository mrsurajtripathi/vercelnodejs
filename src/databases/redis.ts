import { createClient } from 'redis';
//REDIS_URL="redis://default:LzPJPODZjeeRHcwlzkCVxwZSmzOeSFfu@redis-17621.crce217.ap-south-1-1.ec2.cloud.redislabs.com:17621"

export const redisClient = createClient({
    url: 'redis://default:LzPJPODZjeeRHcwlzkCVxwZSmzOeSFfu@redis-17621.crce217.ap-south-1-1.ec2.cloud.redislabs.com:17621'
});

redisClient.on('error', (err) => {
    console.error('Redis Error', err);
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

redisClient.on('ready', () => {
  console.log('Redis ready');
});

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};