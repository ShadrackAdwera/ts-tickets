import mongoose, { Schema, Document, Model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@adwesh/common';

interface OrderAttributes {
    orderId: string;
    version: number;
    userId: string;
    status: OrderStatus;
    price: number;
}

interface OrdersDoc extends Document {
    orderId: string;
    version: number;
    userId: string;
    status: OrderStatus;
    price: number;
}

interface OrderModel extends Model<OrdersDoc> {
    build(attribs: OrderAttributes) : OrdersDoc;
}

const orderSchema = new Schema({
    orderId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, required: true, enum: Object.values(OrderStatus) },
    price: { type: String, required: true }
}, { timestamps: true, toJSON: { getters: true } });

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attribs: OrderAttributes) => {
    return new Order({
        orderId: attribs.orderId,
        version: attribs.version,
        userId: attribs.userId,
        status: attribs.status,
        price: attribs.price
    });
}

const Order = mongoose.model<OrdersDoc, OrderModel>('order', orderSchema);
export { Order };