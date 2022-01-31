import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const ticketsSchema = new Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true }
}, { timestamps: true, toJSON: { getters: true } });

export default mongoose.model('ticket', ticketsSchema);