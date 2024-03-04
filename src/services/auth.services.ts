import User from '../models/user.model';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

interface AuthResponse {
    message: string;
    userId?: string;
}

export const registerUser = async (name: string, email: string, lastname: string): Promise<AuthResponse> => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const newUser = new User({
        name,
        lastname,
        email,
        isActive: false,
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

