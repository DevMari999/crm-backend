import {  Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {NewRequest} from "../types/order.types";

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
        return res.status(401).send({ message: 'No token provided' });
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
        return res.status(403).send({ message: 'Invalid token' });
    }
};



export const validateRefreshToken = (req: NewRequest, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).send({ message: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY || '') as TokenPayload;
        console.log('Refresh token verified successfully:', decoded);


        req.user = {
            _id: decoded.userId,
            role: decoded.userRole,
        };

        next();
    } catch (error) {
        console.error('Refresh token verification failed:', error);
        return res.status(403).send({ message: 'Invalid refresh token' });
    }
};
