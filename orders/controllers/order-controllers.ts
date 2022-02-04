import { HttpError } from '@adwesh/common';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

import Order from '../models/Order';
import Ticket from '../models/Ticket';

const EXPIRATION_SECONDS = 15*60;

interface OrderDoc extends Document {
    userId: string;
    expiresAt: number;
    status: string;
    ticketId: string;
}



const getOrders = async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    let foundOrders: OrderDoc[];

    try {
        foundOrders = await Order.find({ userId }).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    res.status(200).json({orders: foundOrders});
}

const getOrderById = async(req: Request, res: Response, next: NextFunction) => {
    const id  = req.params.id;
    let foundOrder: OrderDoc;

    try {
        foundOrder = await Order.findById(id).exec();    
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    if(!foundOrder) {
        return next(new HttpError('This order does not exist', 404));
    }
    res.status(200).json({order: foundOrder});
}

const createOrder = async(req: Request, res: Response, next: NextFunction) => {
const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs", 422));
  }
  let foundTicket;
  let ticketReservationStatus;

    const { ticketId } = req.body;
    try {
        foundTicket = await Ticket.findById(ticketId).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    if(!foundTicket) {
        return next(new HttpError('This ticket does not exist', 404));
    }

 // TODO: Check if user exists
    const userId = req.user?.userId;

//check if ticket is not reserved
    try {
        ticketReservationStatus = await foundTicket.isReserved();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    if(ticketReservationStatus) {
        return next(new HttpError('This ticket has already been reserved', 403));
    }

    const expiration = new Date();
    const createdOrder: OrderDoc = new Order({
      userId: <string>userId, expiresAt: expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS),
      ticketId, status: 'created'
  }) 

  try {
      await createdOrder.save();
  } catch (error) {
      return next(new HttpError('Your order could not be completed, try again', 500));
  }

  res.status(201).json({message: 'Your order was successfully created', order: createdOrder})

 }