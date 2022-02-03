import { HttpError } from '@adwesh/common';
import { validationResult, ValidationError, Result } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

import { natsWraper } from '../nats-wrapper';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import Ticket from '../models/Ticket';

interface TicketDoc extends Document {
    title: string;
    price: number;
    userId: string;
}

const getTickets = async(req: Request, res: Response, next: NextFunction) => {
    let tickets: TicketDoc[];

    try {
        tickets = await Ticket.find().exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    res.status(200).json({tickets});
}

const findTicketById = async(req: Request, res: Response, next: NextFunction) => {
    const ticketId = req.params.ticketId;
    let ticket: TicketDoc;

    if(!ticketId) {
        return next(new HttpError('Invalid ticket', 400));
    }

    try {
        ticket = await Ticket.findById(ticketId).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    if(!ticket) {
        return next(new HttpError('This ticket does not exist!', 404));
    }
    res.status(200).json({ticket});
}

const getUserTickets = async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;

    let foundTickets: TicketDoc[];

    try {
        foundTickets = await Ticket.find({ userId }).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    res.status(200).json({tickets: foundTickets});
}

const createTicket = async(req: Request, res: Response, next: NextFunction) => {
    const error: Result<ValidationError> = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid ticket inputs', 422));
    }
    const { title, price } = req.body;
    const id = req.user?.userId;

    const newTicket = new Ticket({
        title, price, userId: id
    });

    try {
        await newTicket.save();
    } catch (error) {
        console.log(error);
        return next(new HttpError('An error occured, try again', 500));
    }

    try {
        await new TicketCreatedPublisher(natsWraper.client).publish({
            id: newTicket._id.toString(),
            title: newTicket.title, price: newTicket.price, userId: newTicket.userId
        })
    } catch (error) {
        console.log(error);
    }

    res.status(201).json({message: 'The ticket has been successfully created' ,ticket: newTicket})
}

const updateTicket = async(req: Request, res: Response, next: NextFunction) => {
    const error: Result<ValidationError> = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid ticket inputs', 422));
    }
    const ticketId = req.params.ticketId;
    const foundUserId = req.user?.userId;
    let ticket: TicketDoc;
    const { title, price } = req.body;

    if(!ticketId) {
        return next(new HttpError('Invalid ticket', 400));
    }

    try {
        ticket = await Ticket.findById(ticketId).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    if(!ticket) {
        return next(new HttpError('This ticket does not exist!', 404));
    }

    if(ticket.userId.toString() !== foundUserId) {
        return next(new HttpError('You are not authorized to perform this action', 403));
    }

    ticket.title = title;
    ticket.price = price;
    try {
        await ticket.save();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    res.status(200).json({message: 'Ticket updated successfully', ticket});
}

export default { getTickets, findTicketById, createTicket, updateTicket, getUserTickets };


