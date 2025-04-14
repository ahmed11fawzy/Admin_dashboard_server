import express from "express";
const router = express.Router();

import { getUser, getUsers } from "../Controllers/generalControllers.js";

router.get("/user/:userId", getUser)
.get("/users", getUsers)


export default router;