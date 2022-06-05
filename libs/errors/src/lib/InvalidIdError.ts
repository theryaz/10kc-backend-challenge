import { BackendErrorCode } from "@10kcbackend/constants";
import { BackendError } from "./BackendError";

export class InvalidIdError extends BackendError{
  public code: BackendErrorCode = "InvalidIdError";
  constructor(public detail?: string, public payload?: Record<string,unknown>){
    super("The id provided is malformed. It must be a 24 character hexadecimal string");
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
}