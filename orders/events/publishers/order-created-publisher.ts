import { Subjects, Publisher, OrderCreatedEvent } from '@adwesh/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}