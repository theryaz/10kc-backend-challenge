import { randomString } from './randomString';

describe('randomString', () => {
  it('should return a string of given length', () => {
    expect(randomString(12).length).toEqual(12);
  });
});
