import { HttpError } from '@adwesh/common';
import { validationResult, ValidationError, Result } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

import Ticket from '../models/Ticket';

interface TicketDoc extends Document {
    title: string;
    userId: string
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

const createTicket = async(req: Request, res: Response, next: NextFunction) => {
    const error: Result<ValidationError> = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid ticket inputs', 422));
    }
    const { title } = req.body;
    const id = req.user?.userId;

    const newTicket: TicketDoc = new Ticket({
        title, userId: id
    });

    try {
        await newTicket.save();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    res.status(201).json({message: 'The ticket has been successfully created' ,ticket: newTicket})
}


