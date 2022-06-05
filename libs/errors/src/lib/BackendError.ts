import { BackendErrorCode } from '@10kcbackend/constants';
/**
 * Extend this class to make custom backend-scoped errors.
 *
 */
export abstract class BackendError extends Error {
	/** Status code found in `@bestathletes/ba-constants` */
	public abstract code: BackendErrorCode;
	constructor(
		/** User-facing message about the error */
		public message: string,
		/** Additional details for debugging. Not user facing */
		public detail?: string,
		/** Optional metadata about the error */
		public payload?: Record<string, unknown>
	) {
		super(message);
		this.name = this.constructor.name;
		this.payload = payload;
		Error.captureStackTrace(this, this.constructor);
	}
}
