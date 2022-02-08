import { Subjects, Listener, OrderCreatedEvent } from '@adwesh/common';
import { Message } from 'node-nats-streaming';

import { Order } from '../../models/Orders';

const PAYMENT_QUEUE_GROUP = 'payments-service';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = PAYMENT_QUEUE_GROUP;
    
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const { id, status, userId, version, ticket } = data;

        const newOrder = Order.build({
            orderId: id, status, version, userId, price: ticket.price
        });

        try {
            await newOrder.save();
            msg.ack();
        } catch (error) {
            console.log(error);
        }
    }

}