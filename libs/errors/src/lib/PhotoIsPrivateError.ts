import { BackendErrorCode } from "@10kcbackend/constants";
import { BackendError } from "./BackendError";

export class PhotoIsPrivateError extends BackendError{
  public code: BackendErrorCode = "PhotoIsPrivateError";
  constructor(public detail?: string, public payload?: Record<string,unknown>){
    super("That photo is marked as private and you are not the owner");
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
}