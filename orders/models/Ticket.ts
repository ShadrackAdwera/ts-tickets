import mongoose, { Schema } from 'mongoose';
import { OrderStatus } from '@adwesh/common';
import Order from './Order';

const ticketSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }
});

ticketSchema.methods.isReserved = async function() {
    const foundOrder = await Order.findOne({
        ticket: this,
        status: { $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete] }
    });
    return !!foundOrder;
}

export default mongoose.model('ticket', ticketSchema);