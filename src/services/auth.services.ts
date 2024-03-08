import User from '../models/user.model';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import RefreshTokenSchema from "../models/refresh-token.model";

interface AuthResponse {
    message: string;
    userId?: string;
}

export const registerUser = async (name: string, email: string, lastname: string): Promise<AuthResponse> => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const currentDate = new Date();
    const newUser = new User({
        name,
        lastname,
        email,
        isActive: false,
        created_at: currentDate,
    });

    await newUser.save();

    return {
        message: 'User registered successfully. Please check your email to set your password and activate your account.',
        userId: newUser._id.toString(),
    };
};


export const generateActivationLink = async (userId: string) => {
    console.log(`Starting to generate activation link for user ID: ${userId}`);
    try {
        const user = await User.findById(userId);
        console.log(`Fetched user:`, user);

        if (!user) {
            console.log(`User not found for ID: ${userId}`);
            throw new Error('User not found');
        }

        const activationToken = crypto.randomBytes(20).toString('hex');
        console.log(`Generated activation token: ${activationToken}`);

        user.activationToken = activationToken;
        user.activationTokenExpires = new Date(Date.now() + 3600000);
        console.log(`Set activation token and expiration on user model`);

        await user.save();
        console.log(`User model saved with activation token and expiration`);

        const activationLink = `http://localhost:3000/activate/${activationToken}`;
        console.log(`Generated activation link: ${activationLink}`);

        return activationLink;
    } catch (error) {
        console.error(`Error generating activation link for user ID ${userId}:`, error);
        throw error;
    }
};

const saltRounds = 10;

export const setUserPassword = async (activationToken: string, newPassword: string): Promise<void> => {
    console.log(`Attempting to set password with token: ${activationToken}`);

    const user = await User.findOne({ activationToken });

    if (!user) {
        console.log('No user found with the provided activationToken.');
        throw new Error('Token is invalid, has expired, or does not match any user.');
    }

    console.log(`User found: ${user._id}. Checking token expiration.`);
    if (new Date() > user.activationTokenExpires) {
        console.log('The token has expired.');
        throw new Error('Token is invalid, has expired, or does not match any user.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log(`Password hashed. Updating user's password.`);

    user.password = hashedPassword;
    user.activationToken = undefined;
    user.activationTokenExpires = undefined;
    user.isActive = true;

    await user.save();
    console.log(`Password set successfully. User account is now active: ${user._id}`);
};

export const findUserById = async (userId: string) => {
    try {
        return await User.findById(userId).select('-password');
    } catch (error) {
        console.error('Error in UserService.findUserById:', error);
        throw error;
    }
};


export class RefreshTokenService {
    static async refreshAccessToken(refreshToken: string): Promise<string | null> {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY!) as jwt.JwtPayload;

            const storedToken = await RefreshTokenSchema.findOne({ token: refreshToken, user: decoded.userId });

            if (!storedToken || storedToken.expiresAt < new Date()) {
                throw new Error('Invalid refresh token');
            }

            const accessToken = jwt.sign(
                { userId: decoded.userId, userRole: decoded.userRole },
                process.env.SECRET_KEY!,
                { expiresIn: '1h' }
            );

            return accessToken;
        } catch (error) {
            console.error('Error refreshing access token:', error);
            return null;
        }
    }
}
