import { HttpError } from '@adwesh/common';
import mongoose from 'mongoose';

import app from './app';
import { natsWraper } from './natsWrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

if(!process.env.JWT_KEY) {
    throw new HttpError('JWT must be defined',400);
}

if(!process.env.MONGO_URI) {
    throw new HttpError('MONGO URI must be defined', 400);
}

if(!process.env.NATS_CLIENT_ID) {
    throw new HttpError('NATS CLIENT needs to be defined', 400);
}

if(!process.env.NATS_CLUSTER_ID) {
    throw new HttpError('NATS CLUSTER ID needs to be defined', 400);
}

if(!process.env.NATS_URI) {
    throw new HttpError('NATS URI needs to be defined', 400);
}

const start = async() => {
    try {
        await natsWraper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URI!);

        natsWraper.client.on('close', () => {
            console.log('Payments NATS shutting down . . .');
            process.exit();
        });

        process.on('SIGINT', () => natsWraper.client.close());
        process.on('SIGTERM', () => natsWraper.client.close());

        new OrderCreatedListener(natsWraper.client).listen();   
        new OrderCancelledListener(natsWraper.client).listen();


        await mongoose.connect(process.env.MONGO_URI!);
        app.listen(5003);

        console.log('Connected to Payments DB, listening on PORT: 5003');
    } catch (error) {
        console.log(error);
    }

}
start();


