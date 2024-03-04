import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import * as crypto from 'crypto';
import {generateActivationLink, setUserPassword} from "../services/auth.services";
import bcrypt from 'bcrypt';

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

        const newUser = new User({
            name,
            lastname,
            email,
            isActive: false,
            passwordResetToken,
            passwordResetExpires
        });

        await newUser.save();

        res.status(201).json({message: 'Manager registered successfully. Please check your email to set your password.'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(401).send({message: 'Authentication failed'});
        }

        if (user.banned) {
            return res.status(403).send({message: 'This account has been banned.'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({message: 'Authentication failed'});
        }

        const token = jwt.sign(
            {userId: user._id, email: user.email, userRole: user.role},
            process.env.SECRET_KEY,
            {expiresIn: '1h'}
        );

        res.send({token});
    } catch (error) {
        res.status(500).send(error);
    }
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

