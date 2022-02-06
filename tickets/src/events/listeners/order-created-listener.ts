import { Document } from 'mongoose';
import { Subjects, Listener, OrderCreatedEvent } from '@adwesh/common';
import { Message } from 'node-nats-streaming';

import { TICKETS_QUEUE_GROUP } from './constants';
import Ticket from '../../models/Ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { natsWraper } from '../../nats-wrapper';


interface TicketDoc extends Document {
    title: string;
    price: number;
    userId: string;
    orderId: string;
    version: number;
}

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = TICKETS_QUEUE_GROUP;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        let foundTicket: TicketDoc;

        foundTicket = await Ticket.findById(data.ticket.id).exec();
        if(!foundTicket) {
            throw new Error('This ticket does not exist');
        }

        foundTicket.orderId = data.id;
        try {
            await foundTicket.save();
            await new TicketUpdatedPublisher(this.client).publish({
                id: foundTicket.id,
                price: foundTicket.price,
                title: foundTicket.title,
                userId: foundTicket.userId,
                orderId: foundTicket.orderId,
                version: foundTicket.version
            })
            msg.ack();
        } catch (error) {
            throw new Error('An error occured, try again');
        }

    }
    
}