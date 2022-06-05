import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
config();
export function createJwt<P = Record<string,unknown>>(data: P): string {
	return sign(data as Record<string, unknown>, process.env.JWT_PRIVATE_KEY || "changeme");
}
