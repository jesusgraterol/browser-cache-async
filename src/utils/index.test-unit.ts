/* eslint-disable max-len */
import { describe, test, expect, afterEach, vi } from 'vitest';
import ms from 'ms';
import { ERRORS } from '../shared/errors.js';
import {
  calculateRevalidateTime,
  buildQueryOptions,
  canQueryBeCached,
  wrapData,
  unwrapData,
} from './index.js';

/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */


describe('Query Options', () => {
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



  describe('buildQueryOptions', () => {
    test.each<Array<any>>([
      [
        { query: () => Promise.resolve(123) },
        { id: undefined, cacheIfType: 'undefined', revalidate: 86400000 },
      ],
      [
        { id: '7281bfdc-c983-4d03-b7ad-96db698b4a14', query: () => Promise.resolve(123) },
        { id: '7281bfdc-c983-4d03-b7ad-96db698b4a14', cacheIfType: 'undefined', revalidate: 86400000 },
      ],
      [
        { id: 123, query: () => Promise.resolve(123), cacheIf: () => true },
        { id: 123, cacheIfType: 'function', revalidate: 86400000 },
      ],
      [
        { id: 123, query: () => Promise.resolve(123), cacheIf: () => Promise.resolve(true) },
        { id: 123, cacheIfType: 'function', revalidate: 86400000 },
      ],
      [
        { id: 123, query: () => Promise.resolve(123), cacheIf: () => Promise.resolve(true), revalidate: 546123 },
        { id: 123, cacheIfType: 'function', revalidate: 546123 },
      ],
      [
        { id: 123, query: () => Promise.resolve(123), cacheIf: () => Promise.resolve(true), revalidate: '7 days' },
        { id: 123, cacheIfType: 'function', revalidate: ms('7 days') },
      ],
    ])('buildQueryOptions(%o) -> %o', (input, expected) => {
      const opts = buildQueryOptions(input);
      expect(opts).toBeTypeOf('object');
      expect(opts.id).toBe(expected.id);
      expect(opts.query).toBeTypeOf('function');
      expect(opts.cacheIf).toBeTypeOf(expected.cacheIfType as any);
      expect(opts.revalidate).toBe(expected.revalidate);
    });

    test('throws an error if the query is not a function', () => {
      expect(() => buildQueryOptions({ query: 123 } as any)).toThrowError(ERRORS.INVALID_QUERY_FUNCTION);
    });
  });



  describe('canQueryBeCached', () => {
    test.each([
      ['some-id', { foo: 'bar' }, undefined, true],
      ['some-id', { foo: 'bar' }, true, true],
      ['some-id', { foo: 'bar' }, false, false],
      ['some-id', { foo: 'bar' }, () => true, true],
      ['some-id', { foo: 'bar' }, () => false, false],
      ['some-id', { foo: 'bar' }, () => Promise.resolve(true), true],
      ['some-id', { foo: 'bar' }, () => Promise.resolve(false), false],
    ])('', async (id, data, cacheIf, expected) => {
      await expect(canQueryBeCached(id, data, cacheIf)).resolves.toBe(expected);
    });
  });
});





describe('Data Wrapping', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('wrapData', () => {
    test('can wrap a piece of data', () => {
      const currentTime = Date.now();
      vi.useFakeTimers();
      vi.setSystemTime(currentTime);
      expect(wrapData(123, 1000)).toStrictEqual({ data: 123, staleAt: currentTime + 1000 });
    });
  });

  describe('unwrapData', () => {
    test('can unwrap fresh data', () => {
      const currentTime = Date.now();
      vi.useFakeTimers();
      vi.setSystemTime(currentTime);
      expect(unwrapData({ data: { foo: 'baz' }, staleAt: currentTime + 1000 })).toStrictEqual({ foo: 'baz' });
    });

    test('can unwrap stale data', () => {
      const currentTime = Date.now();
      vi.useFakeTimers();
      vi.setSystemTime(currentTime);
      expect(unwrapData({ data: { foo: 'baz' }, staleAt: currentTime - 1000 })).toBeUndefined();
    });

    test('returns undefined if no data was passed', () => {
      expect(unwrapData(undefined)).toBeUndefined();
    });
  });
});
