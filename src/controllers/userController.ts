import { Request, Response } from 'express';
import UserService from '../services/user.services';

const getAllManagers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await UserService.getUsersWithRoleManager();
        res.json(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export default {
    getAllManagers,
};
