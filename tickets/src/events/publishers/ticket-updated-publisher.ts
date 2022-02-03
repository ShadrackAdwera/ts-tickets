import { Subjects, Publisher, TicketUpdatedEvent } from '@adwesh/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated; 
}