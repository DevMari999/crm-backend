import User from '../models/user.model';
import { IUser } from '../types/user.types';

const getUsersWithRoleManager = async (): Promise<IUser[]> => {
    try {
        const users = await User.find({ role: 'manager' });
        return users;
    } catch (error) {
        throw error;
    }
};

export default {
    getUsersWithRoleManager,
};
