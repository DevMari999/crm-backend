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
    activationToken: string;
    activationTokenExpires: Date;
    banned: Boolean;
    created_at: Date;
    last_login: Date;

}


export interface UserPayload {
    _id: string;
    role: string;
}
