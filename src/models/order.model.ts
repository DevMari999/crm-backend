import mongoose, {Schema} from "mongoose";

import {IOrder} from "../types/order.types";

const commentSchema = new Schema({
    managerId: {type: String},
    comment: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

const statusEnum = ['pending', 'completed', 'cancelled', 'in work', 'dubbing'];
const courseTypeEnum = ['QACX', 'PCX', 'JSCX', 'JCX', 'FS', 'FE'];


const orderSchema = new Schema<IOrder>(
    {
        name: {type: String},
        surname: {type: String},
        email: {type: String},
        phone: {type: String},
        age: {type: Number, default: null},
        course: {type: String},
        course_format: {type: String},
        course_type: {type: String, default: null, enum: courseTypeEnum},
        sum: {type: Number, default: 0},
        already_paid: {type: Boolean, default: null},
        created_at: {type: Date},
        utm: {type: String, default: ''},
        msg: {type: String, default: null},
        status: {type: String, default: null, enum: statusEnum},
        group: {type: String, default: ''},
        manager: {type: String, default: ''},
        comments: [commentSchema]
    }
)

const Order = mongoose.model<IOrder>("Order", orderSchema, "orders");
export default Order;
