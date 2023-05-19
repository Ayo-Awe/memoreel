import { Request, Response } from "express";

export async function welcomeHandler(req: Request, res: Response) {
  const payload = {
    status: "success",
    data: {
      message: "Welcome to memoreel API",
    },
  };
  res.status(200).json(payload);
}
