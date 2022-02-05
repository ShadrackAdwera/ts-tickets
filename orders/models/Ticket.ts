import mongoose, { Schema } from 'mongoose';
import { OrderStatus } from '@adwesh/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

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

ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);

export default mongoose.model('ticket', ticketSchema);