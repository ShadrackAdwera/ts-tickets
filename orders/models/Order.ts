import mongoose, { Schema } from 'mongoose';

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
    status: { type: String, required: true, enum: [ "created", "cancelled", "awaiting_payment", "complete" ] },
    expiresAt: { type: Date, required: true },
    ticket: { type: Schema.Types.ObjectId, required: true }
}, { timestamps: true, toJSON: { getters: true } });

export default mongoose.model('order', orderSchema);