import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HttpError, OrderStatus } from '@adwesh/common';

import { Order } from '../models/Orders';
import { Payment } from '../models/Payment';
import { stripe } from '../stripe';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWraper } from '../natsWrapper';

const createPayment = async(req: Request, res: Response, next: NextFunction) => {

    //test token: tok_visa

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }

    const { orderId, token } = req.body;
    const userId = req.user?.userId;
    let foundOrder;
    //find order

    try {
        foundOrder = await Order.findOne({ orderId }).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    if(!foundOrder) {
        return next(new HttpError('This order is not valid', 400));
    }

    if(foundOrder.userId!==userId) {
        return next(new HttpError('You are not authorized to handle this order', 403));
    }

    if(foundOrder.status===OrderStatus.Cancelled) {
        return next(new HttpError('You cannot pay for a cancelled order', 400));
    }

    try {
        const { id } = await stripe.charges.create({
            currency: 'usd',
            amount: foundOrder.price * 100,
            source: token
        });

        const payment = new Payment({
            orderId, stripeId: id
        });

        await payment.save();

        await new PaymentCreatedPublisher(natsWraper.client).publish({
            orderId: payment.orderId, stripeId: payment.stripeId, id: payment.id
        });
    } catch (error) {
        console.log(error);
        return next(new HttpError('An error occured, try again', 500));
    }

    res.status(201).json({message: 'The charge has been successfully created'});

}

export { createPayment };