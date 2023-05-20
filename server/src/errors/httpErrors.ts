import {
  BadRequestErrorCode,
  ForbiddenErrorCode,
  HttpErrorCode,
  ResourceNotFoundErrorCode,
  ServerErrorCode,
  UnauthorizedErrorCode,
} from "./httpErrorCodes";

export abstract class HttpError extends Error {
  errorCode: HttpErrorCode;
  statusCode: number;

  constructor(statusCode: number, message: string, errorCode: HttpErrorCode) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}

export class BadRequest extends HttpError {
  constructor(message: string, errorCode: BadRequestErrorCode) {
    super(400, message, errorCode);
  }
}

export class ResourceNotFound extends HttpError {
  constructor(message: string, errorCode: ResourceNotFoundErrorCode) {
    super(404, message, errorCode);
  }
}

export class Unauthorized extends HttpError {
  constructor(message: string, errorCode: UnauthorizedErrorCode) {
    super(401, message, errorCode);
  }
}

export class Forbidden extends HttpError {
  constructor(message: string, errorCode: ForbiddenErrorCode) {
    super(403, message, errorCode);
  }
}

export class ServerError extends HttpError {
  constructor(message: string, errorCode: ServerErrorCode) {
    super(500, message, errorCode);
  }
}
