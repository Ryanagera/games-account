import { clerkMiddleware, getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import prisma from "../config/database.js";
import { sendError } from "../utils/response.js";

// Apply globally or per route
export const clerkAuth = clerkMiddleware();

// Middleware to ensure user exists in the database
export const requireUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId: clerkId } = getAuth(req);

  if (!clerkId) {
    return sendError(res, "Unauthorized. Clerk Authentication Required.", 401);
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
      return sendError(
        res,
        "User not found in database. Please sync account.",
        404,
      );
    }

    req.dbUser = user;
    req.userId = clerkId;
    next();
  } catch (error) {
    console.error("requireUser Error:", error);
    return sendError(res, "Internal server error during authentication", 500);
  }
};
