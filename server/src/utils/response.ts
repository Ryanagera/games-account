import type { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: any,
  message = "Success",
  status = 200,
) => {
  return res.status(status).json({ success: true, data, message });
};

export const sendError = (res: Response, message: string, status = 500) => {
  return res.status(status).json({ success: false, error: message });
};
