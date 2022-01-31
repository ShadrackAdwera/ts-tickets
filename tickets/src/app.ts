import { HttpError } from '@adwesh/common';
import express, { NextFunction, Request, Response } from 'express';

import ticketRoutes from './routes/ticket-routes';

const app = express();

app.use(express.json());

//CORS
app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','OPTIONS, PUT, PATCH, POST, DELETE, GET');
    next();
  });

app.use('/api/tickets', ticketRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    throw new HttpError('This route / method does not exist', 404);
});

app.use((error: Error, _req: Request, res: Response, next: NextFunction) => {
    if(res.headersSent) {
        return next(error);
    }
    res.status(500).json({ message: error.message || 'An error occured, try again' });
});

export default app;


