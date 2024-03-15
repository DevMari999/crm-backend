import {Response, NextFunction} from 'express';
import {NewRequest} from "../types/request.types";

const isAdmin = (req: NewRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        console.log(res.status);
        return res.status(401).send({message: 'Authentication required'});

    }

    if (req.user.role !== 'admin') {
        console.log(req.user.role);
        return res.status(403).send({message: 'Access denied. Admins only.'});
    }

    next();
};

export default isAdmin;

