import { checkAuth } from '@adwesh/common';
import { body } from 'express-validator';
import express from 'express';
import mongoose from 'mongoose';

import orderControllers from '../controllers/order-controllers';

const router = express.Router();

const { getOrderById, getOrders, createOrder, cancelOrder } = orderControllers;

router.use(checkAuth);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/new', [
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input)=> mongoose.Types.ObjectId.isValid(input))
] ,createOrder);
router.patch('/:id', cancelOrder);

export default router;


