import { Document } from 'mongoose';
import { Subjects, Listener, OrderCreatedEvent, OrderStatus } from '@adwesh/common';
import { Message } from 'node-nats-streaming';

import { ORDERS_QUEUE_GROUP } from './constants';
import Ticket from '../../models/Ticket';


interface TicketDoc extends Document {
    title: string;
    price: number;
    userId: string;
    orderId: string;
}

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = ORDERS_QUEUE_GROUP;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        let foundTicket: TicketDoc;

        foundTicket = await Ticket.findById(data.ticket.id).exec();
        if(!foundTicket) {
            throw new Error('This ticket does not exist');
        }

        foundTicket.orderId = data.id;
        try {
            await foundTicket.save();
            msg.ack();
        } catch (error) {
            throw new Error('An error occured, try again');
        }

    }
    
}