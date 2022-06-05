import { safeCompare } from './safeCompare';

describe('safeCompare', () => {
  it('should return false', () => {
    expect(safeCompare("abc", "def")).toEqual(false);
  });
  it('should return true', () => {
    expect(safeCompare("abc", "abc")).toEqual(true);
  });
});
