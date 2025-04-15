import { getMe, login, logout, signUp } from "../controllers/auth.controller.js";
import express from "express";
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);


export default router;