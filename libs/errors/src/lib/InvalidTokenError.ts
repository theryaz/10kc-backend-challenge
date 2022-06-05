import { BackendErrorCode } from "@10kcbackend/constants";
import { BackendError } from "./BackendError";

export class InvalidTokenError extends BackendError{
  public code: BackendErrorCode = "InvalidTokenError";
  constructor(public detail?: string, public payload?: Record<string,unknown>){
    super("The given token is invalid");
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
}