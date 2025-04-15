import { Product } from "../Models/productModel.js";
import { ProductStat } from "../Models/productStatModel.js";
import { Transaction } from "../Models/transactionModel.js";
import { User } from "../Models/userModel.js";
import  getCountryIso3  from "country-iso-2-to-3";
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

// not optimised version of getGeography function
// This version fetches all users  and then processes them using reduce, map to get the geography data. 

/* export const getGeography=async (req, res, next) => {
  const start = process.hrtime.bigint(); // Start measuring time
  try {
    const users = await User.find().lean().exec();
    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = { value: 0 };
      }
      acc[countryISO3].value += 1;
      return acc;
    }, {});

    if (!mappedLocations) {
      throw new Error(" locations not found");
    }
    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, { value }]) => ({ id: country, value })
    );

    res.status(200).json({ data: formattedLocations });
  } catch (error) {
    next(error);
  } finally {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000; // convert nanoseconds to milliseconds
    console.log(`getGeography execution time: ${durationMs.toFixed(2)} ms`);
  }
} */

// Optimised version of getGeography function
export const getGeography = async (req, res, next) => {
  const start = process.hrtime.bigint(); // Start measuring time
  try {
    // Only fetch the country field from the database
    const users = await User.find({}, { country: 1, _id: 0 }).lean().exec();

    // Create both object and array in a single pass
    const mappedLocations = {};
    const formattedLocations = [];

    // Use a Map to track which countries we've already processed
    const processedCountries = new Map();

    for (const { country } of users) {
      const countryISO3 = getCountryIso3(country);

      if (!mappedLocations[countryISO3]) {
        // Initialize new country entry
        mappedLocations[countryISO3] = { value: 1 };

        // Create the formatted entry and store its reference
        const formattedEntry = { id: countryISO3, value: 1 };
        formattedLocations.push(formattedEntry);

        // Store reference to the formatted entry for quick updates
        processedCountries.set(countryISO3, formattedEntry);
      } else {
        // Update existing entry
        mappedLocations[countryISO3].value += 1;

        // Also update the corresponding formatted entry directly
        processedCountries.get(countryISO3).value += 1;
      }
    }

    if (formattedLocations.length === 0) {
      throw new Error("Locations not found");
    }

    res.status(200).json({ data: formattedLocations });
  } catch (error) {
    next(error);
  } finally {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000; // convert nanoseconds to milliseconds
    console.log(`getGeography execution time: ${durationMs.toFixed(2)} ms`);
  }
};