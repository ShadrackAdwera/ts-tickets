import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWraper } from "../nats-wrapper";

interface JobPayload {
    orderId: string;
}

const expirationQueue = new Queue<JobPayload>('order:expiration', { 
    redis: {
        host: process.env!.REDIS_HOST
    }
 });

expirationQueue.process(async (job) => {
    await new ExpirationCompletePublisher(natsWraper.client).publish({ OrderId: job.data.orderId });
});

export { expirationQueue };