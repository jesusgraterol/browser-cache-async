import ms from 'ms';
import { encodeError } from 'error-message-utils';
import { IRecordID } from 'browser-keyval-stores';
import {
  ICacheIfFn,
  IStringValue,
  IProcessedQueryOptions,
  IQueryOptions,
  IWrappedData,
} from '../shared/types.js';
import { ERRORS } from '../shared/errors.js';

/* ************************************************************************************************
 *                                         QUERY OPTIONS                                          *
 ************************************************************************************************ */

/**
 * Invokes the ms library to convert a time duration string into milliseconds in a stable manner.
 * If for any reason it cannot compute the value, it returns undefined.
 * @param value
 * @returns number | undefined
 */
const __ms = (value: IStringValue): number | undefined => {
  try {
    return ms(value);
  } catch (e) {
    return undefined;
  }
};

/**
 * Given a StringValue or a number, returns the number of milliseconds before the data becomes
 * stale.
 * @param revalidate
 * @returns number
 * @throws
 * - INVALID_REVALIDATE_VALUE: If the revalidate value is not a valid number or StringValue.
 */
const calculateRevalidateTime = (revalidate: IStringValue | number = '1 day'): number => {
  // init the result
  let result;

  // calculate the value based on the provided type
  if (typeof revalidate === 'number' && revalidate > 0) {
    result = revalidate;
  }
  if (typeof revalidate === 'string') {
    result = __ms(revalidate);
  }

  // ensure the revalidate value is valid
  if (typeof result !== 'number') {
    throw new Error(encodeError(`The provided revalidate value '${revalidate}' is invalid. Please provide either a numeric value representing milliseconds (e.g., 1000) or a valid time duration string (e.g., "1 hour" or "35 s").`, ERRORS.INVALID_REVALIDATE_VALUE));
  }

  // finally, return the result
  return result;
};

/**
 * Validates and builds the query options object based on a partial one. It also calculates the
 * revalidate time.
 * @param options
 * @returns IProcessedQueryOptions<T>
 * @throws
 * - INVALID_QUERY_FUNCTION: If the query function is not a function.
 * - INVALID_REVALIDATE_VALUE: If the revalidate value is not a valid number or StringValue.
 */
const buildQueryOptions = <T>(options: IQueryOptions<T>): IProcessedQueryOptions<T> => {
  if (typeof options.query !== 'function') {
    throw new Error(encodeError('The query function provided in the functions is invalid.', ERRORS.INVALID_QUERY_FUNCTION));
  }
  return {
    ...options,
    revalidate: calculateRevalidateTime(options.revalidate),
  };
};

/**
 * Verifies if the data retrieved from the query can be cached based on the cacheIf function.
 * @param id
 * @param data
 * @param cacheIf
 * @returns Promise<boolean>
 */
const canQueryBeCached = async <T>(
  id: IRecordID,
  data: T,
  cacheIf: ICacheIfFn<T> | boolean | undefined,
): Promise<boolean> => {
  if (typeof cacheIf === 'function') {
    return cacheIf(id, data);
  }
  if (typeof cacheIf === 'boolean') {
    return cacheIf;
  }
  return true;
};





/* ************************************************************************************************
 *                                         DATA WRAPPING                                          *
 ************************************************************************************************ */

/**
 * Wraps a given record with a timestamp indicating when it will become stale.
 * @param data
 * @param revalidate
 * @returns IWrappedData<T>
 */
const wrapData = <T>(data: T, revalidate: number): IWrappedData<T> => ({
  data,
  staleAt: Date.now() + revalidate,
});

/**
 * Unwraps the data from the wrapped object. If the data is stale, it returns undefined.
 * @param wrappedData
 * @returns T | undefined
 */
const unwrapData = <T>(wrappedData: IWrappedData<T> | undefined): T | undefined => (
  (
    Boolean(wrappedData)
    && typeof wrappedData === 'object'
    && wrappedData.staleAt > Date.now()
  )
    ? wrappedData.data
    : undefined
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // query options
  calculateRevalidateTime,
  buildQueryOptions,
  canQueryBeCached,

  // data wrapping
  wrapData,
  unwrapData,
};
