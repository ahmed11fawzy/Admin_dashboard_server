import express from "express";
const router = express.Router();

import { getUser } from "../Controllers/generalControllers.js";

router.get("/user/:userId",getUser)



export default router;