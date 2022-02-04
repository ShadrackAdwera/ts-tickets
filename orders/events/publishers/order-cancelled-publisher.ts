import { Subjects, Publisher, OrderCancelledEvent } from '@adwesh/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}