import {Document} from "mongoose";
import {Request} from "express";

export interface IComment {
    managerId?: string;
    comment: string;
    createdAt: Date;
}

export interface IOrder extends Document {
    name: string;
    surname: string;
    email: string;
    phone: string;
    age: number;
    course: string;
    course_format: string;
    course_type: string;
    sum: number | null;
    already_paid: boolean | null;
    created_at: Date;
    utm: string;
    msg: string | null;
    status: string | null;
    group: string | null;
    manager: string | null;
    comments: IComment[];
}

export interface NewRequest extends Request {
    user?: {
        _id: string;
        role: string;
    };
}
