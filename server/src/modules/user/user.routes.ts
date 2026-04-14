import express from "express";
import { syncUserController, getCurrentUser } from "./user.controller.js";
import { clerkAuth, requireUser } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Public / Semi-public route (Only needs Clerk auth, not DB user)
router.post("/sync", clerkAuth, syncUserController);

// Protected routes (Needs DB user)
router.get("/me", clerkAuth, requireUser, getCurrentUser);

export default router;
