import mongoose, {Schema} from "mongoose";

import {IOrder} from "../types/order.types";

const orderSchema = new Schema<IOrder>(
    {
        name: { type: String },
        surname: { type: String},
        email: { type: String},
        phone: { type: String},
        age: { type: Number },
        course: { type: String},
        course_format: { type: String },
        course_type: { type: String},
        sum: { type: Number, default: null },
        already_paid: { type: Boolean, default: null },
        created_at: { type: Date },
        utm: { type: String, default: '' },
        msg: { type: String, default: null },
        status: { type: String, default: null }
    }
)

const Order = mongoose.model<IOrder>("Order", orderSchema, "orders");
export default Order;
