import mongoose from 'mongoose';
import { User } from '../Models/userModel.js';

export const getAdmains = async (req, res, next) => {
    try {

        const admins = await User.find({ role: 'admin' }).select('-password -__v');
        if (!admins) {
            throw new Error('No admins found');
        }
        res.status(200).json({data:admins});

    } catch (error) {
        next(error);
    }
}