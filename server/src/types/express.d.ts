import { Response } from "express";

import { HttpErrorCode } from "../errors/httpErrorCodes";

declare global {
  namespace Express {
    export interface Response {
      ok(payload: any): Response;
      created(payload: any): Response;
      noContent(): Response;
      error(
        statusCode: number,
        message: string,
        errorCode: HttpErrorCode
      ): Response;
    }
    export interface Request {
      user?: { id: number; email: string };
    }
    namespace Multer {
      export interface File {
        key?: string;
        bucket?: string;
        key?: string;
        acl?: string;
      }
    }
  }
}
