import { Product } from "../Models/productModel.js";
import { ProductStat } from "../Models/productStatModel.js";
import { Transaction } from "../Models/transactionModel.js";
import { User } from "../Models/userModel.js";
export const getProducts = async (req, res,next) => {
    try {
        const products = await Product.find();
        
        if (!products) {
            throw new Error( 'Products not found');
        }
        const productWithStat = await Promise.all(
            products.map(async (product) => {
                const stat = await ProductStat.find({ productId: product._id })
                return {
                    ...product._doc,
                    stat,
                };
            })
        );
        res.status(200).json({data:productWithStat});
    } catch (error) {
        next(error);
    }
}


export const getCustomers = async (req, res, next) => {
  try {
    
    const customers = await User.find({role:"user"}).select("-password").lean().exec();
    if (!customers) {
      throw new Error(" customers not found");
    }
    res.status(200).json({ data: customers });
  } catch (error) {
    next(error);
  }
};



export const getTransactions = async (req, res, next) => {
  try {
    // sorting should be like this: { field: "cost", sort: "desc" } or { field: "cost", sort: "asc" } 
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;
    const generateSort=()=> {
        const parsedSort = JSON.parse(sort);
        const formattedSort = {
          [parsedSort.field]: (parsedSort.sort === "asc" ? 1 : -1),
        };
        return formattedSort; 
    }
    
    const sortFormatted = Boolean(sort) ? generateSort() : { };
    const transactions = await Transaction.find({
      $or :[
        {cost: {$regex:new RegExp(search,"i") }},
        {userId: {$regex:new RegExp(search,"i") }},
      ]
    })
      .sort(sortFormatted)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean()
      .exec();
    const total = await Transaction.countDocuments({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    });
    if (!transactions) {
      throw new Error(" transactions not found");
    }
    res.status(200).json({ data: transactions, total,page,pageSize });
    
  } catch (error) {
    next(error);
  } 
}