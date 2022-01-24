import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import authRoutes from './routes/auth-routes';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use((_req: Request, _res: Response, _next: NextFunction) => {
    throw new Error('Cannot find method / route');
});

app.use((error: Error ,_req: Request, res: Response, next: NextFunction) => {
    if(res.headersSent) {
        return next(error);
    }
    res.status(500).json({message: error.message || 'An error occured, try again'});
});

mongoose.connect(<string>process.env.MONGO_URI)
.then(_=>{
    app.listen(5000);
    console.log('Auth service listening on PORT: 5000!')
}).catch(error=>console.log(error));
