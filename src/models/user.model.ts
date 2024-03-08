import mongoose, {Schema} from 'mongoose';
import {IUser} from '../types/user.types';


const UserSchema: Schema = new Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String},
    isActive: {type: Boolean, default: false},
    passwordResetToken: {type: String},
    passwordResetExpires: {type: Date},
    role: {type: String, default: 'manager'},
    activationToken: { type: String },
    activationTokenExpires: { type: Date },
    banned: { type: Boolean, default: false},
    created_at:{ type: Date, required: true },

});

export default mongoose.model<IUser>('User', UserSchema);
