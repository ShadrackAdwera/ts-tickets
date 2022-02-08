import { Subjects, Publisher, PaymentCreatedEvent } from '@adwesh/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}