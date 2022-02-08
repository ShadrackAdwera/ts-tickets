import { Subjects, Listener, OrderCancelledEvent, OrderStatus } from '@adwesh/common';
import { Message } from 'node-nats-streaming';

import { Order } from '../../models/Orders';

const PAYMENT_QUEUE_GROUP = 'payments-service';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = PAYMENT_QUEUE_GROUP;
    
    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
        const { id, version } = data;
        let foundOrder = await Order.find({orderId: id, version: version-1 }).exec();

        if(!foundOrder || foundOrder.length===0) {
            throw new Error('This order does not exist');
        }

        foundOrder[0].status = OrderStatus.Cancelled;

        try {
            await foundOrder[0].save();
            msg.ack();
        } catch (error) {
            console.log(error);
        }
    }
}
