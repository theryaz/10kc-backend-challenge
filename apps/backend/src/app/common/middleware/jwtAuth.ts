import { verifyJwt } from '@10kcbackend/crypto';
import { UnauthorizedError } from '@10kcbackend/errors';
import { Request, Response,  NextFunction } from 'express';
import { JwtPayload } from '../../user/dtos/JwtPayload';
export function jwtAuth(req: Request, res: Response, next: NextFunction): void{
	const jwt = req.headers['authorization'];
	if (!jwt){
		throw new UnauthorizedError("No JWT Provided in header");
	}
	// Split Bearer xxx
	const [,token] = jwt.split(' ');
	try{
		const result = verifyJwt<JwtPayload>(token);
		req.userId = result.userId;
		req.username = result.username;
		next();
	}catch(e){
		return next(new UnauthorizedError("JWT Check Failed"));
	}
}