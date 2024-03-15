import User from '../models/user.model';
import {IUser} from '../types/user.types';
import {SortCriteria} from "../utils/queryBuilder.utils";

const getUsersWithRoleManager = async (page: number, limit: number, sort: SortCriteria): Promise<{
    users: IUser[],
    total: number
}> => {
    try {
        const skip = (page - 1) * limit;
        const total = await User.countDocuments({role: 'manager'});

        const users = await User.find({role: 'manager'}).sort(sort).skip(skip).limit(limit);

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


const banManager = async (id: string): Promise<IUser | null> => {
    const user = await User.findByIdAndUpdate(id, {banned: true}, {new: true});
    return user;
};


const unbanManager = async (id: string): Promise<IUser | null> => {
    const user = await User.findByIdAndUpdate(id, {banned: false}, {new: true});
    return user;
};


const deleteManager = async (id: string): Promise<{ deleted: boolean; message?: string }> => {
    try {
        const result = await User.findByIdAndDelete(id);
        if (result) {
            return {deleted: true};
        }
        return {deleted: false, message: 'Manager not found'};
    } catch (error) {
        throw error;
    }
};

export default {
    getUsersWithRoleManager,
    getUserById,
    banManager,
    unbanManager,
    deleteManager,
};
