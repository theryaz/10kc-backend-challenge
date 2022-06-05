import { timingSafeEqual } from 'crypto';
/**
 * Compares two strings in a fixed amount of time
 */
export function safeCompare(a: string, b: string): boolean {
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
