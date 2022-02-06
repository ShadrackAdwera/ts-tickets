import Queue from "bull";

interface JobPayload {
    orderId: string;
}

const expirationQueue = new Queue<JobPayload>('order:expiration', { 
    redis: {
        host: process.env!.REDIS_HOST
    }
 });

expirationQueue.process(async (job) => {
    console.log(`Expiration complete event for Order: ${job.data.orderId}`);
});

export { expirationQueue };