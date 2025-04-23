
import {User} from '../Models/userModel.js';
import {OverallStat} from '../Models/overAllStatModel.js';
import {Transaction} from '../Models/transactionModel.js'

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
export const getDashboardStats = async (req, res ,next) => { 
    try {
        const currentYear = 2021;
        const currentMonth = 'November';
        const currentDay = '2021-11-15';

        const transaction = await Transaction.find().sort({createdOn: -1}).limit(50);
        /* over All state */
        const overallStat = await OverallStat.find({year: currentYear});
        const {totalCustomers, yearlySalesTotal, yearlyTotalSoldUnits ,monthlyData,salesByCategory} = overallStat[0];
        const thisMonthStats = overallStat[0].monthlyData.find(({month}) => month === currentMonth);
        const todayStats = overallStat[0].dailyData.find(({date}) => date === currentDay);
        res.status(200).json({
            totalCustomers,
            yearlySalesTotal,
            yearlyTotalSoldUnits,
            monthlyData,
            salesByCategory,
            thisMonthStats,
            todayStats,
            transaction
        });
    } catch (error) {
        next(error);
    }
}