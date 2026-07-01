export class ApiError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number, options?: ErrorOptions) {
    super(message, options);

    this.statusCode = statusCode;
    this.message = message;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}