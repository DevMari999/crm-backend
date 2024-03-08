import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import * as crypto from 'crypto';
import {findUserById, generateActivationLink, RefreshTokenService, setUserPassword} from "../services/auth.services";
import bcrypt from 'bcrypt';
import {NewRequest} from "../types/order.types";
import {generateAndStoreRefreshToken} from "../utils/refreshToken.utils";

export const register = async (req: Request, res: Response) => {
    try {
        const {name, email, lastname} = req.body;
        console.log(req.body);
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        const passwordResetToken = crypto.randomBytes(20).toString('hex');
        const passwordResetExpires = Date.now() + 3600000;
        const currentDate = Date.now();

        const newUser = new User({
            name,
            lastname,
            email,
            isActive: false,
            passwordResetToken,
            passwordResetExpires,
            created_at: currentDate
        });

        await newUser.save();

        res.status(201).json({message: 'Manager registered successfully. Please check your email to set your password.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};


export const login = async (req: Request, res: Response) => {
    console.log('Login endpoint hit');
    try {
        const {email, password} = req.body;
        console.log('Attempting login for:', email);

        const user = await User.findOne({email});
        console.log('User found:', !!user);

        if (!user) {
            console.log('Login failed: User not found');
            return res.status(401).send({message: 'Authentication failed'});
        }

        if (user.banned) {
            console.log('Login failed: User is banned');
            return res.status(403).send({message: 'This account has been banned.'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            console.log('Login failed: Password does not match');
            return res.status(401).send({message: 'Authentication failed'});
        }

        const accessToken = jwt.sign(
            {userId: user._id,  userRole: user.role},
            process.env.SECRET_KEY,
            {expiresIn: '1h'}
        );
        console.log('Access token generated');

        const refreshToken = jwt.sign(
            {userId: user._id},
            process.env.REFRESH_SECRET_KEY,
            {expiresIn: '7d'}
        );
        console.log('Refresh token generated');

        const expiresIn = 7 * 24 * 60 * 60 * 1000;
        await generateAndStoreRefreshToken(user._id, refreshToken, expiresIn);
        console.log('Refresh token stored');

        res.cookie('token', accessToken, {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', expires: new Date(Date.now() + 3600000)});
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', expires: new Date(Date.now() + 7*24*3600000)});

        console.log('Login successful, sending response');
        res.status(200).send({message: 'Login successful'});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send(error);
    }
};


export const logout = (req: Request, res: Response) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' });
    return res.status(200).send({ message: 'Logout successful' });
};

export const generateLink = async (req: Request, res: Response) => {
    try {
        const {userId} = req.params;
        console.log(userId);
        const activationLink = await generateActivationLink(userId);
        console.log(`Activation link for user ${userId}: ${activationLink}`);
        res.json({message: 'Activation link generated.', activationLink});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};
export const setPassword = async (req: Request, res: Response) => {
    try {
        const {activationToken, newPassword} = req.body;

        await setUserPassword(activationToken, newPassword);

        res.status(200).send({message: 'Password set successfully. Your account is now active.'});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};

export const getUserDetails = async (req: NewRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const user = await findUserById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        res.json({
            userId: user._id,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            role: user.role,

        });
    } catch (error) {
        console.error('Failed to retrieve user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const refresh = async (req: Request, res: Response) => {

    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
        return res.status(400).send({ message: 'Refresh token is required' });
    }

    const newAccessToken = await RefreshTokenService.refreshAccessToken(refreshToken);

    if (newAccessToken) {
        return res.status(200).send({ accessToken: newAccessToken });
    } else {
        return res.status(401).send({ message: 'Failed to refresh access token' });
    }
};
