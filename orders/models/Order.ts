import mongoose, { Schema } from 'mongoose';
import { OrderStatus } from '@adwesh/common';

/*Order Statuses
created - order has been created but the ticket has not been reserved.

cancelled - ticket from which the order was created has already been reserved by another order, 
or order expires before payment,
or order has been cancelled.

awaiting:payment - order successfully reserved the ticket.

complete - order has reserved the ticket and user has paid the amount successfully.
*/

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.Created },
    expiresAt: { type: Schema.Types.Date, required: true },
    ticket: { type: Schema.Types.ObjectId, required: true, ref: 'Ticket' }
}, { timestamps: true, toJSON: { getters: true } });

export default mongoose.model('order', orderSchema);