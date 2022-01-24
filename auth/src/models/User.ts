import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true, min: 6 },
    resetToken: { type: String },
    tokenExpirationDate: { type: Date }
}, { timestamps: true, toJSON: { getters: true } });

export default mongoose.model('user', userSchema);