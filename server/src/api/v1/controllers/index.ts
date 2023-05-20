import { Request, Response } from "express";

export async function welcomeHandler(req: Request, res: Response) {
  const payload = {
    message: "Welcome to memoreel API",
  };

  res.ok(payload);
}
