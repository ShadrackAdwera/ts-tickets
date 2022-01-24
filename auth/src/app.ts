import express, { NextFunction, Request, Response } from 'express';

const app = express();

app.use(express.json());

app.use((_req: Request, _res: Response, _next: NextFunction) => {
    throw new Error('Cannot find method / route');
});

app.use((error: Error ,_req: Request, res: Response, next: NextFunction) => {
    if(res.headersSent) {
        return next(error);
    }
    res.status(500).json({message: error.message || 'An error occured, try again'});
})

app.listen(5000);