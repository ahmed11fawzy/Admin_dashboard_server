
import {User} from '../Models/userModel.js';


export const getUser= async (req, res ,next) => {
        try {
            const {userId} = req.params;
            if (!userId) {
                throw new Error('User ID is required');
            }
            const user = await User.findById(userId);
            if (!user) {
                throw new Error( 'User not found');
            }
            res.status(200).json({data:user});
        } catch (error) {
            next(error);
        }
    }
export const getUsers = async (req, res ,next) => {
    try {
        const users = await User.find();
        if (!users) {
            throw new Error( 'Users not found');
        }
        res.status(200).json({data:users});
    } catch (error) {
        next(error);
    }
}