import express from "express";
const router = express.Router();
import { getAdmains } from "../Controllers/managementControllers.js";

router.get("/admins", getAdmains);

export default router;