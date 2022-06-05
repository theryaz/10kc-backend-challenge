import { BackendErrorCode } from "@10kcbackend/constants";
import { BackendError } from "./BackendError";

export class UsernameTakenError extends BackendError{
  public code: BackendErrorCode = "UsernameTakenError";
  constructor(public detail?: string, public payload?: Record<string,unknown>){
    super("That username is already taken.");
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
}