import { HttpError } from '@adwesh/common';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

import Order from '../models/Order';

interface OrderI extends Document {
    userId: string;
    expiresAt: string;
    status: string;
    ticketId: string;
}

const getOrders = async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    let foundOrders: Document[];

    try {
        foundOrders = await Order.find({ userId }).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    res.status(200).json({orders: foundOrders});
}