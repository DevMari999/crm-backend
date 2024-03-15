import {Request} from "express";

export interface NewRequest extends Request {
    user?: {
        _id: string;
        role: string;
    };
    order?: any;
}
