import { Message } from 'node-nats-streaming';
import { Document } from 'mongoose';
import { Listener, Subjects, TicketCreatedEvent } from '@adwesh/common';

import { ORDERS_QUEUE_GROUP } from './queue-group-name';
import Ticket from '../../models/Ticket';

interface TicketAttributes {
    id: string;
    title: string;
    price: number;
    version: number;
}

interface TicketDoc extends Document {
    id: string;
    title: string;
    price: number;
    version: number;
}

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = ORDERS_QUEUE_GROUP;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        const newTicket : TicketDoc = new Ticket<TicketAttributes>({
            id, title, price, version: 1
        })
        try {
            await newTicket.save();
            msg.ack();
        } catch (error) {
            console.log(error);
        }
    }
    
}