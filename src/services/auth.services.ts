import User from '../models/user.model';
import * as crypto from 'crypto';

interface AuthResponse {
    message: string;
    userId?: string;
}

export const registerUser = async (name: string, email: string, lastname: string): Promise<AuthResponse> => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const passwordResetToken = crypto.randomBytes(20).toString('hex');
    const passwordResetExpires = Date.now() + 3600000; // 1 hour from now

    const newUser = new User({
        name,
        lastname,
        email,
        isActive: false,
        passwordResetToken,
        passwordResetExpires
    });

    await newUser.save();

    return { message: 'Manager registered successfully. Please check your email to set your password.', userId: newUser._id.toString() };
};
