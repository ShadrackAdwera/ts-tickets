import { Document } from 'mongoose';
import { Subjects, Listener, ExpirationCompleteEvent, OrderStatus } from '@adwesh/common';
import { Message } from 'node-nats-streaming';

import { ORDERS_QUEUE_GROUP } from './queue-group-name';
import Order from '../../models/Order';
import Ticket from '../../models/Ticket';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

interface TicketDoc extends Document {
    title: string;
    price: number;
    version: number;
    isReserved: () => boolean
}

interface OrderDoc extends Document {
    userId: string;
    expiresAt: Date;
    status: OrderStatus;
    ticket: TicketDoc;
    version: number;
}


export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName: string = ORDERS_QUEUE_GROUP;
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {
        let foundOrder: OrderDoc;
        let foundTicket: TicketDoc;

        foundOrder = await Order.findById(data.OrderId).exec();
        if(!foundOrder) {
            throw new Error('This order does not exist!');
        }

        foundTicket = await Ticket.findById(foundOrder.ticket).exec();

        if(!foundTicket) {
            throw new Error('The ticket for this order was not found');
        }

        foundOrder.status = OrderStatus.Cancelled;
        await foundOrder.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: data.OrderId, status: OrderStatus.Cancelled, ticket: {
                id: foundTicket.id,
                price: foundTicket.price
            }, userId: foundOrder.userId, version: foundOrder.version
        });

        msg.ack();
    }
    
}