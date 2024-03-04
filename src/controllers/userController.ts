import {Request, Response} from 'express';
import UserService from '../services/user.services';

const getAllManagers = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Accessing /api/managers");
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;

        const {users, total} = await UserService.getUsersWithRoleManager(page, limit);
        const totalPages = Math.ceil(total / limit);

        res.json({
            users,
            totalPages,
            currentPage: page,
            limit,
            totalManagers: total
        });
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const user = await UserService.getUserById(id);
        if (!user) {
            res.status(404).send({message: 'User not found'});
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


const banManager = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const user = await UserService.banManager(id);
        if (!user) {
            res.status(404).send({ message: 'Manager not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const unbanManager = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const user = await UserService.unbanManager(id);
        if (!user) {
            res.status(404).send({ message: 'Manager not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const deleteManager = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const { deleted, message } = await UserService.deleteManager(id);
        if (!deleted) {
            res.status(404).send({ message: message || 'Manager not found' });
            return;
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};



export default {
    getAllManagers,
    getUserById,
    banManager,
    unbanManager,
    deleteManager,
};
