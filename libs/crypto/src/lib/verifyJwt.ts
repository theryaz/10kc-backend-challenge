import { verify, JwtPayload } from 'jsonwebtoken';
import { config } from 'dotenv';
import { InvalidTokenError } from '@10kcbackend/errors';
config();
export function verifyJwt<P = unknown>(token: string): JwtPayload & P {
	try{
		return verify(token, process.env.JWT_PRIVATE_KEY || "changeme") as JwtPayload & P;
	}catch(e){
		throw new InvalidTokenError("The token was invalid", { originalError: e });
	}
}
