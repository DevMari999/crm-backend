import mongoose, {Schema} from 'mongoose';
import {IRefreshToken} from '../types/refresh-token.types';

const RefreshTokenSchema: Schema<IRefreshToken> = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    token: {type: String, required: true},
    expiresAt: {type: Date, required: true}
});

export default mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
