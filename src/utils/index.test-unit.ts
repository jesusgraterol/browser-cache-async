import { describe, test, expect } from 'vitest';
import { calculateRevalidateTime } from './index.js';
import { ERRORS } from '../shared/errors.js';

/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */

describe('calculateRevalidateTime', () => {
  test.each<Array<any>>([
    ['10 s', 10000],
    ['10s', 10000],
    ['2 m', 120000],
    ['2m', 120000],
    ['1 h', 3600000],
    ['1h', 3600000],
    [undefined, 86400000], // defaults to 1 day
  ])('calculateRevalidateTime(%s) -> %i', (input, expected) => {
    expect(calculateRevalidateTime(input)).toBe(expected);
  });

  test.each<Array<any>>([
    ['1 dddd'],
    ['1 dayz'],
    ['invalid'],
    [''],
    [' '],
  ])('calculateRevalidateTime(%s) -> INVALID_REVALIDATE_VALUE', (input) => {
    expect(() => calculateRevalidateTime(input)).toThrowError(ERRORS.INVALID_REVALIDATE_VALUE);
  });
});
