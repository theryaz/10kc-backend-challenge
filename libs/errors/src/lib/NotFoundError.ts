import { BackendErrorCode } from "@10kcbackend/constants";
import { BackendError } from "./BackendError";

export class NotFoundError extends BackendError{
  public code: BackendErrorCode = "NotFoundError";
  constructor(public detail?: string, public payload?: Record<string,unknown>){
    super("The object could not be found");
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
}