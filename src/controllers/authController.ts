import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import * as crypto from 'crypto';
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, lastname } = req.body;
        console.log(req.body);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const passwordResetToken = crypto.randomBytes(20).toString('hex');
        const passwordResetExpires = Date.now() + 3600000;

        const newUser = new User({
            name,
            lastname,
            email,
            isActive: false,
            passwordResetToken,
            passwordResetExpires
        });

        await newUser.save();

        res.status(201).json({ message: 'Manager registered successfully. Please check your email to set your password.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).send({ message: 'Authentication failed' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, roles: user.role },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.send({ token });
    } catch (error) {
        res.status(500).send(error);
    }
};


export const setPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send({ message: 'Password reset token is invalid or has expired.' });
        }

        user.password = password;
        user.isActive = true;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.send({ message: 'Your password has been set successfully. Your account is now active.' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
