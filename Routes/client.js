import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
} from "../Controllers/clientControllers.js";
const router = express.Router();



router.get("/products", getProducts)
    .get("/customers", getCustomers)
    .get("/transactions", getTransactions)

export default router;