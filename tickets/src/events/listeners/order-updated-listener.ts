import { Document } from 'mongoose';
import { Subjects, Listener, OrderCancelledEvent, OrderStatus } from '@adwesh/common';
import { Message } from 'node-nats-streaming';

import { TICKETS_QUEUE_GROUP } from './constants';
import Ticket from '../../models/Ticket';

interface TicketDoc extends Document {
    title: string;
    price: number;
    userId: string;
    orderId?: string;
}

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = TICKETS_QUEUE_GROUP;
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        let foundTicket: TicketDoc;
        console.log(data);
        foundTicket = await Ticket.findById(data.ticket.id).exec();

        if(!foundTicket) {
            throw new Error('This ticket does not exist!');
        }
        console.log(foundTicket);
        foundTicket.orderId = undefined;
        try {
            await foundTicket.save();
            msg.ack();
        } catch (error) {
            throw new Error('An error occured, try again');
        }
    }

}