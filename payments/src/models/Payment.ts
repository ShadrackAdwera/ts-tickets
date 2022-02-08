import mongoose, { Schema, Document, Model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PaymentsAttributes {
    orderId: string;
    stripeId: string;
}

interface PaymentDoc extends Document {
    orderId: string;
    stripeId: string;
    version: number;
}

interface PaymentModel extends Model<PaymentDoc>{
    orderId: string;
    stripeId: string;
}

const paymentSchema = new Schema({
    orderId: { type: String, required: true },
    stripeId: { type:String, required: true }
}, { timestamps: true, toJSON: { getters: true } });

paymentSchema.statics.build = (attribs: PaymentsAttributes) => {
    return new Payment({
        orderId: attribs.orderId,
        stripeId: attribs.stripeId
    })
}

paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(updateIfCurrentPlugin);

const Payment = mongoose.model<PaymentDoc, PaymentModel>('payment', paymentSchema);

export { Payment };



