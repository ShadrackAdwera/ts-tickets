import express, { Request, Response, NextFunction } from 'express';
import { HttpError } from '@adwesh/common';

const app = express();

app.use(express.json());

//CORS
app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','OPTIONS, PUT, PATCH, POST, DELETE, GET');
    next();
  });
  
//use routes


app.use((req: Request, res: Response, next: NextFunction) => {
    throw new HttpError('Unable to find method / route', 404);
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if(res.headersSent) {
        return next(error);
    }
    res.status(500).json({message: error.message || 'An error occured, try again'});
});

export default app;