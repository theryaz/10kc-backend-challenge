import { sha256 } from './sha256';

describe('sha256', () => {
  it('should make a sha256 hash', () => {
    expect(sha256("abc")).toBeTruthy();
    expect(sha256("abc").length).toBe(44);
    expect(sha256("abcdef").length).toBe(44);
    expect(sha256("abcdefhij").length).toBe(44);
  });
});
