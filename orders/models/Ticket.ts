import mongoose, { Schema } from 'mongoose';
import Order from './Order';

const ticketSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: String, required: true },
    version: { type: Number, required: true }
}, { _id: false });

ticketSchema.methods.isReserved = async function() {
    const foundOrder = await Order.findOne({
        ticket: this,
        status: { $in: ["created", "awaiting_payment", "complete"] }
    });
    return !!foundOrder;
}

export default mongoose.model('ticket', ticketSchema);