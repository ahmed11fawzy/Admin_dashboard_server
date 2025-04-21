import express from "express";
import { getOverallStat } from "../Controllers/salesControllers.js";
const router = express.Router();

router.get("/overallstat", getOverallStat);

export default router;