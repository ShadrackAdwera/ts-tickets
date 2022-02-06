import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    private _client?: Stan;

    get client() : Stan {
        if(!this._client) {
            throw new Error('NATS must be initialised');
        }
        return this._client;
    }
    
    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url });
        return new Promise<void>((resolve, reject)=>{
            this.client.on('connect', ()=>{
                console.log('Connected to NATS');
                resolve();
            });
            this.client.on('error', (err)=>{
                reject(err);
            })
        })
    }

}

export const natsWraper = new NatsWrapper();