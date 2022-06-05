import { createJwt } from './createJwt';
import { verifyJwt } from './verifyJwt';
import { InvalidTokenError } from '@10kcbackend/errors';

describe('jwt', () => {
	describe('createJwt', () => {
		it("should return a jwt", () => {
			const payload = { "hello": 123 };
			expect(typeof createJwt(payload)).toBe('string');
		})
	});
	describe('verifyJwt', () => {
		it("should verify an existing jwt", () => {
			const payload = { "hello": 123 };
			const jwt = createJwt(payload);
			const result = verifyJwt<{hello: string}>(jwt);
			expect(result.hello).toBe(payload.hello);
		})
		it("should reject an invalid jwt", () => {
			const payload = { "hello": 123 };
			const jwt = createJwt(payload);
			expect(() => verifyJwt<{ hello: string }>(`${jwt}1`)).toThrowError(InvalidTokenError);
		})
	});
});
