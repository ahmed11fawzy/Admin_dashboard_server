import express from "express";
const router = express.Router();

import {
  getUser,
  getUsers,
  getDashboardStats,
} from "../Controllers/generalControllers.js";

router.get("/user/:userId", getUser)
.get("/users", getUsers)
.get("/dashboard",getDashboardStats)


export default router;