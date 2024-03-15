import {Document, ObjectId} from 'mongoose';

export interface IRefreshToken extends Document {
    user: ObjectId;
    token: string;
    expiresAt: Date;
}
