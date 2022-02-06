import { natsWraper } from './nats-wrapper';

const start = async() => {

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
    } catch (error) {
        console.log(error)
    }
}

start();