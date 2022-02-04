import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    ticketId: { type: Schema.Types.ObjectId, required: true }
}, { timestamps: true, toJSON: { getters: true } });

export default mongoose.model('order', orderSchema);