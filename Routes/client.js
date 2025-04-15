import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
} from "../Controllers/clientControllers.js";
const router = express.Router();



router
  .get("/products", getProducts)
  .get("/customers", getCustomers)
  .get("/transactions", getTransactions)
  .get("/geography", getGeography);

export default router;