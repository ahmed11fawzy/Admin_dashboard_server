import {OverallStat} from '../Models/overAllStatModel.js';


export const getOverallStat = async (req, res, next) => {

    try {
        const overallStat = await OverallStat.find().lean().exec();
        if (!overallStat) {
            throw new Error(" overallStat not found");
        }
        res.status(200).json({ data: overallStat });
    } catch (error) {
        next(error);
    }
}