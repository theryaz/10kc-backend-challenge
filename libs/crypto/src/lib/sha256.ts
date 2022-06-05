import { createHash } from 'crypto';

export function sha256(data: string): string {
	return createHash('sha256').update(data).digest('base64');
}
