import { Document } from 'mongoose';
import { Subjects, Listener, OrderCancelledEvent } from '@adwesh/common';
import { Message } from 'node-nats-streaming';

import { TICKETS_QUEUE_GROUP } from './constants';
import Ticket from '../../models/Ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

interface TicketDoc extends Document {
    title: string;
    price: number;
    userId: string;
    orderId?: string;
    version: number;
}

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = TICKETS_QUEUE_GROUP;
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        let foundTicket: TicketDoc;
        foundTicket = await Ticket.findById(data.ticket.id).exec();

        if(!foundTicket) {
            throw new Error('This ticket does not exist!');
        }
        foundTicket.orderId = undefined;
        try {
            await foundTicket.save();
            await new TicketUpdatedPublisher(this.client).publish({
                id: foundTicket.id.toString(), 
                price: foundTicket.price, 
                title: foundTicket.title, 
                userId: foundTicket.userId, 
                version: foundTicket.version
            })
            msg.ack();
        } catch (error) {
            throw new Error('An error occured, try again');
        }
    }

}