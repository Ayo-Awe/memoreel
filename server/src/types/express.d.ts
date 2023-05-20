import { Response } from "express";

declare global {
  namespace Express {
    export interface Response {
      ok(payload: any): Response;
      created(payload: any): Response;
      noContent(): Response;
      error(statusCode: number, message: string, errorCode: string): Response;
    }
  }
}
