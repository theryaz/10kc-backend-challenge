import { ALLOWED_PHOTO_TYPES, BackendErrorCode } from "@10kcbackend/constants";
import { BackendError } from "./BackendError";

export class UnsupportedImageTypeError extends BackendError{
  public code: BackendErrorCode = "UnsupportedImageTypeError";
  constructor(public detail?: string, public payload?: Record<string,unknown>){
    super("An image was found to be an unsupported type. Supported types: " + ALLOWED_PHOTO_TYPES.join(', '));
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
}