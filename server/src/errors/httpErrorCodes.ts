export type ResourceNotFoundErrorCode =
  | "RESOURCE_NOT_FOUND"
  | "UNKNOWN_ENDPOINT";

export type BadRequestErrorCode =
  | "INVALID_REQUEST_PARAMETERS"
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_JSON_FORMAT"
  | "EMAIL_ALREADY_VERIFIED";

export type UnauthorizedErrorCode =
  | "EXPIRED_TOKEN"
  | "MISSING_AUTH_HEADER"
  | "MALFORMED_TOKEN"
  | "INVALID_TOKEN";

export type ForbiddenErrorCode =
  | "ACCESS_DENIED"
  | "INSUFFICIENT_PERMISSIONS"
  | "USER_NOT_VERIFIED";

export type ServerErrorCode =
  | "UNEXPECTED_ERROR"
  | "DATABASE_ERROR"
  | "THIRD_PARTY_API_FAILURE";

export type ConflictErrorCode =
  | "EXISTING_USER_EMAIL"
  | "REEL_CONFIRMATION_OVERDUE"
  | "REEL_ALREADY_CONFIRMED";

export type HttpErrorCode =
  | ResourceNotFoundErrorCode
  | BadRequestErrorCode
  | UnauthorizedErrorCode
  | ForbiddenErrorCode
  | ServerErrorCode
  | ConflictErrorCode;
