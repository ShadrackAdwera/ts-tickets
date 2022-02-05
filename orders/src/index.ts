import mongoose from 'mongoose';

import { natsWraper } from './nats-wrapper';
import { TicketCreatedListener } from '../events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from '../events/listeners/ticket-updated-listener';
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

        new TicketCreatedListener(natsWraper.client).listen();
        new TicketUpdatedListener(natsWraper.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
        app.listen(5002);
    console.log('Orders service listening on PORT: 5002!')
    } catch (error) {
        console.log(error)
    }

}

start();