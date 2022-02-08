import { body } from 'express-validator';
import { checkAuth } from '@adwesh/common';
import express from 'express';

import { createPayment } from '../controllers/payment-controllers';

const router = express.Router();

router.use(checkAuth);

router.post('/new', [
    body('orderId').not().isEmpty(),
    body('token').not().isEmpty()
], createPayment);

export default router;


