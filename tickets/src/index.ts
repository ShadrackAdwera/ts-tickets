import mongoose from 'mongoose';

import { natsWraper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-updated-listener';
import app from './app';

const start = async() => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT must be defined');
    }

    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }

    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    if(!process.env.NATS_URI) {
        throw new Error('NATS_URI must be defined');
    }

    try {
        await natsWraper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URI);

        natsWraper.client.on('close', () => {
            console.log('NATS shutting down . . .');
            process.exit();
        });

        process.on('SIGINT', () => natsWraper.client.close());
        process.on('SIGTERM', () => natsWraper.client.close());

        new OrderCreatedListener(natsWraper.client).listen();
        new OrderCancelledListener(natsWraper.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
        app.listen(5001);
    console.log('Tickets service listening on PORT: 5001!')
    } catch (error) {
        console.log(error)
    }

}

start();