import {Request, Response, NextFunction} from 'express';

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', error);

    const statusCode = res.statusCode === 200 ? (error.statusCode || 500) : res.statusCode;
    res.status(statusCode);

    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
};

export default errorHandler;
