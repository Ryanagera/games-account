import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { sendSuccess, sendError } from "../../utils/response.js";
import { syncUser } from "./user.service.js";

export const syncUserController = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return sendError(res, "Unauthorized. Clerk Authentication Required.", 401);
    }

    const { email, username, avatarUrl } = req.body;

    if (!email) {
      return sendError(res, "Email is required to sync user", 400);
    }

    const user = await syncUser(clerkId, email, username, avatarUrl);

    return sendSuccess(res, user, "User synchronized successfully", 200);
  } catch (error: any) {
    console.error("Sync User Error:", error);
    return sendError(res, "Failed to synchronize user", 500);
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // req.dbUser implies that 'requireUser' middleware has been run
    // For type safety, check if it exists:
    if (!req.dbUser) {
      return sendError(res, "User not found in request context", 404);
    }

    return sendSuccess(res, req.dbUser, "Successfully retrieved current user", 200);
  } catch (error: any) {
    console.error("Get Current User Error:", error);
    return sendError(res, "Failed to retrieve current user", 500);
  }
};
