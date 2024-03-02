import {Document} from "mongoose";

export interface IUser extends Document {
    name: string;
    lastname: string;
    email: string;
    password: string;
    isActive: boolean;
    passwordResetToken: string;
    passwordResetExpires: Date;
    role: string;
}


export interface UserPayload {
    _id: string;
    username: string;
    role: string;
}
