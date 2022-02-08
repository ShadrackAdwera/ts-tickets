import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from '@adwesh/common';

import { ORDERS_QUEUE_GROUP } from './queue-group-name';
import Order from '../../models/Order';
import { Message } from 'node-nats-streaming';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName: string = ORDERS_QUEUE_GROUP;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
        try {
            const { orderId } = data;
            const foundOrder = await Order.findById(orderId).exec();
            if(!foundOrder) {
                throw new Error('This order does not exist');
            }
            foundOrder.status = OrderStatus.Complete
            await foundOrder.save();
            msg.ack();
        } catch (error) {
            console.log(error);
        }
    }
}