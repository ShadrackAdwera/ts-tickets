import mongoose from 'mongoose';

import { natsWraper } from './nats-wrapper';
import app from './app';

const start = async() => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT must be defined');
    }

    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    try {
        await natsWraper.connect('ticketing', 'deez_nuts', 'http://nats-service:4222');

        natsWraper.client.on('close', () => {
            console.log('NATS shutting down . . .');
            process.exit();
        });

        process.on('SIGINT', () => natsWraper.client.close());
        process.on('SIGTERM', () => natsWraper.client.close());

        await mongoose.connect(process.env.MONGO_URI);
        app.listen(5001);
    console.log('Tickets service listening on PORT: 5001!')
    } catch (error) {
        console.log(error)
    }

}

start();