import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../../../errors/httpErrors";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(
        new Unauthorized("Missing Auth header", "MISSING_AUTH_HEADER")
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new Unauthorized("Malformed token", "MALFORMED_TOKEN"));
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = payload as { uid: number };
    next();
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      next(new Unauthorized("Token expired", "EXPIRED_TOKEN"));
    } else if (error instanceof JsonWebTokenError) {
      next(new Unauthorized("Token expired", "INVALID_TOKEN"));
    } else {
      next(error);
    }
  }
}
