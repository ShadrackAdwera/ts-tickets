import { Subjects, Listener, OrderCreatedEvent } from '@adwesh/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';


const ORDERS_QUEUE_GROUP = 'expiration-service';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = ORDERS_QUEUE_GROUP;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const delayTime = new Date(data.expiresAt).getTime() - new Date().getTime();
        await expirationQueue.add({
            orderId: data.id
        }, { delay: delayTime});

        msg.ack();
    }
    
}