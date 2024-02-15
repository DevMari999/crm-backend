import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserPayload } from "../types/user.types";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).send({ message: 'A token is required for authentication' });
    }

    try {
        const secretKey = process.env.SECRET_KEY || 'default_secret_key';
        const decoded = jwt.verify(token, secretKey);

        if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
            req.user = decoded as UserPayload;
        } else {
            throw new Error('Invalid token payload');
        }
    } catch (err) {
        return res.status(401).send({ message: 'Invalid Token' });
    }

    next();
};
