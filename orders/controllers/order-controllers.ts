import { HttpError, OrderStatus } from '@adwesh/common';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

import Order from '../models/Order';
import Ticket from '../models/Ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWraper } from '../src/nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const EXPIRATION_SECONDS = 15*60;

interface TicketDoc extends Document {
    title: string;
    price: number;
    version: number;
    isReserved: () => boolean
}

interface OrderDoc extends Document {
    userId: string;
    expiresAt: Date;
    status: OrderStatus;
    ticket: TicketDoc;
    version: number;
}

interface OrderAttributes {
    userId: string;
    expiresAt: number;
    status: OrderStatus;
    ticket: TicketDoc;
}



const getOrders = async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    let foundOrders: OrderDoc[];

    try {
        foundOrders = await Order.find({ userId }).populate('ticket').exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    res.status(200).json({orders: foundOrders});
}

const getOrderById = async(req: Request, res: Response, next: NextFunction) => {
    const id  = req.params.id;
    let foundOrder

    try {
        foundOrder = await Order.find({ id: id, userId: req.user?.userId }).populate('ticket').exec();    
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
  let foundTicket: TicketDoc[];
  let ticketReservationStatus;

    //check for ticket existense in the DB
    const { ticketId } = req.body;
    try {
        foundTicket = await Ticket.find({id: ticketId}).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    if(foundTicket.length===0) {
        return next(new HttpError('This ticket does not exist', 404));
    }

 // TODO: Check if user exists
    const userId = req.user?.userId as string;

//check if ticket is not reserved
    try {
        ticketReservationStatus = await foundTicket[0].isReserved();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    if(ticketReservationStatus) {
        return next(new HttpError('This ticket has already been reserved', 403));
    }

    const expiration = new Date();
    const createdOrder: OrderDoc = new Order<OrderAttributes>({
      userId, 
      expiresAt: expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS),
      status: OrderStatus.Created, 
      ticket: foundTicket[0]
  }) 

  try {
      await createdOrder.save();
  } catch (error) {
      return next(new HttpError('Your order could not be completed, try again', 500));
  }

  // TODO: transaction on emit and event and save to the DB.

  try {
     await new OrderCreatedPublisher(natsWraper.client).publish({
         id: createdOrder.id, userId: createdOrder.userId, ticket: { 
             id: foundTicket[0].id,
             price: foundTicket[0].price
          }, status: OrderStatus.Created, 
          version: createdOrder.version,
          expiresAt: createdOrder.expiresAt.toISOString()
     })
  } catch (error) {
      console.log(error);
  }

  res.status(201).json({message: 'Your order was successfully created', order: createdOrder})

 }

 const cancelOrder = async(req: Request, res: Response, next: NextFunction) => {
    const { id  } = req.params;
    let foundOrder: OrderDoc;
    let foundTicket: TicketDoc;
    let userId = req.user?.userId as string
    // find the order
    try {
        foundOrder = await Order.findById(id).exec();
    } catch (error) {
        console.log(error);
        return next(new HttpError('An error occured, try again', 500));
    }

    if(!foundOrder) {
        return next(new HttpError('This order does not exist', 404));
    }

    try {
        foundTicket = await Ticket.findById(foundOrder.ticket).exec();
    } catch (error) {
        console.log(error);
        return next(new HttpError('An error occured, try again', 500));
    }

    if(!foundTicket) {
        return next(new HttpError('This ticket does not exist', 404));
    }

    // authorization
    if(foundOrder.userId.toString()!== userId) {
        return next(new HttpError('You are not authorized to perform this action', 401));
    }

    foundOrder.status = OrderStatus.Cancelled;
    //update expiration date??
    try {
        await foundOrder.save();
    } catch (error) {
        console.log(error);
        return next(new HttpError('An error occured, try again', 500));
    }
    
    try {
        await new OrderCancelledPublisher(natsWraper.client).publish({
            id: foundOrder.id, status: OrderStatus.Cancelled, 
            userId: userId, ticket: {
                id: foundTicket.id,
                price: foundTicket.price
            },
            version: foundOrder.version,
        })
    } catch (error) {
        
    }

     res.status(200).json({message: `Your order ref: ${foundOrder.id} has been cancelled!`});
 }

 export default { getOrders, getOrderById, createOrder, cancelOrder };