import { Request, Response, NextFunction } from 'express';
import { BackendError } from '@10kcbackend/errors';
import Debug from 'debug';
const debug = Debug("10kc:errorHandler");

const { NODE_ENV } = process.env;

export function errorHandler(error: BackendError, _: Request, res: Response, next: NextFunction): void {
	if (error && (error as BackendError).code) {
		const backendError: BackendError = error as BackendError;
		debug(`Error handled [${backendError.code}]: ${backendError.message}. ${backendError.detail}`, error);
		console.error(error);
		const responseBody: any = {
			error: {
				message: backendError.message,
				code: backendError.code,
			}
		};
		let responseCode: number;
		switch ((error as BackendError).code){
			case 'NotFoundError':
				responseCode = 404;
				break;
			case 'InvalidIdError':
			case 'InvalidTokenError':
			case 'UsernameTakenError':
				responseCode = 400;
				break;
			case 'UnauthorizedError':
				responseCode = 401;
				break;
			case 'PhotoIsPrivateError':
				responseCode = 403;
				break;
			default:
				responseCode = 500;
		}
		if (NODE_ENV !== 'production') {
			responseBody.error.detail = backendError.detail;
			responseBody.error.payload = backendError.payload;
		}
		res.status(responseCode).json(responseBody);
		return;
	}
	next();
}
