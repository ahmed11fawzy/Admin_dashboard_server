import express from "express";
const router = express.Router();
import { getAdmains , getUserPerformance } from "../Controllers/managementControllers.js";

router.get("/admins", getAdmains)
      .get("/performance/:id", getUserPerformance)
export default router;