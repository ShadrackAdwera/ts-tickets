import { Subjects, Listener, TicketUpdatedEvent } from '@adwesh/common';
import { Document } from 'mongoose';
import { Message } from 'node-nats-streaming';

import Ticket from '../../models/Ticket';
import { ORDERS_QUEUE_GROUP } from './queue-group-name';

interface TicketDoc extends Document {
    id: string;
    title: string;
    price: number;
    version: number;
}

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName: string = ORDERS_QUEUE_GROUP;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        let foundTicket: TicketDoc[];
        foundTicket = await Ticket.find({ id }).exec();
        if(foundTicket.length>0) {
            foundTicket[0].title = title;
            foundTicket[0].price = price;
        }
        await foundTicket[0].save();
        msg.ack();
    }
    
}