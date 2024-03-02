import User from '../models/user.model';
import {IUser} from '../types/user.types';

const getUsersWithRoleManager = async (page: number, limit: number): Promise<{ users: IUser[], total: number }> => {
    try {
        const skip = (page - 1) * limit;
        const total = await User.countDocuments({role: 'manager'});
        const users = await User.find({role: 'manager'}).skip(skip).limit(limit);
        return {users, total};
    } catch (error) {
        throw error;
    }
};


const getUserById = async (id: string): Promise<IUser | null> => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        throw error;
    }
};

export default {
    getUsersWithRoleManager,
    getUserById,
};
