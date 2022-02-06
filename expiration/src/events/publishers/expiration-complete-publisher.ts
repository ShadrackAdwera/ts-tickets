import { Subjects, Publisher, ExpirationCompleteEvent } from '@adwesh/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}