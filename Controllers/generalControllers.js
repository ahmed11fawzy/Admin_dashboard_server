
import {User} from '../Models/userModel.js';


export const getUser= async (req, res ,next) => {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) {
                throw new Error({ message: 'User not found' });
            }
            res.status(200).json({data:user});
        } catch (error) {
            next(error);
        }
    }
