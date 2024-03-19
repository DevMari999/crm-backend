import {Response, NextFunction, Request} from 'express';
import jwt from 'jsonwebtoken';
import {NewRequest} from "../types/request.types";

interface TokenPayload {
    userId: string;
    username: string;
    userRole: string;
    iat?: number;
    exp?: number;
}


export const authenticate = (req: NewRequest, res: Response, next: NextFunction) => {
    console.log('Authentication middleware called');

    const token = req.cookies.token;
    console.log('Extracted Token from Cookies:', token);

    if (!token) {
        console.log('No token provided');
        return res.status(401).send({message: 'No token provided'});
    }

    try {
        console.log('Verifying token...');
        const decoded = jwt.verify(token, process.env.SECRET_KEY || '') as TokenPayload;
        console.log('Token verified successfully:', decoded);

        req.user = {
            _id: decoded.userId,
            role: decoded.userRole,
        };

        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).send({message: 'Invalid token'});
    }
};


export function validateEmail(req: Request, res: Response, next: NextFunction) {
    const {email} = req.body;
    const emailRegex = /\S+@\S+\.\S+/;

    if (!email) {
        return res.status(400).send('Email is required.');
    }

    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email format.');
    }

    next();
}


export function validatePassword(req: Request, res: Response, next: NextFunction) {
    const { password, newPassword } = req.body;
    const passwordMinLength = 8;

    if (!password && !newPassword) {
        return res.status(400).json({ error: 'Password is required.' });
    }

    if (password && password.length < passwordMinLength) {
        return res.status(400).json({ error: `Password must be at least ${passwordMinLength} characters long.` });
    }

    if (newPassword && newPassword.length < passwordMinLength) {
        return res.status(400).json({ error: `New password must be at least ${passwordMinLength} characters long.` });
    }

    next();
}

