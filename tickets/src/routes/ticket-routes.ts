import { Router } from 'express';
import { body } from 'express-validator';
import { checkAuth } from '@adwesh/common';

import ticketControllers from '../controllers/ticket-controllers';

const router: Router = Router();

const { getTickets, findTicketById, createTicket, updateTicket, getUserTickets } = ticketControllers;

router.get('/', getTickets);
router.get('/:ticketId', findTicketById);

router.use(checkAuth);

router.get('/user', getUserTickets);

router.post('/new', [
    body('title').trim().isLength({min: 6}),
    body('price').trim().isLength({min: 2})
], createTicket);

router.patch('/:ticketId', [
    body('title').trim().isLength({min: 6}),
    body('price').trim().isLength({min: 2})
], updateTicket);

export default router;

