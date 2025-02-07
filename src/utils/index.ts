import ms, { StringValue } from 'ms';
import { encodeError } from 'error-message-utils';
import { ERRORS } from '../shared/errors.js';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Invokes the ms library to convert a time duration string into milliseconds in a stable manner.
 * If for any reason it cannot compute the value, it returns undefined.
 * @param value
 * @returns number | undefined
 */
const __ms = (value: StringValue): number | undefined => {
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
const calculateRevalidateTime = (revalidate: StringValue | number = '1 day'): number => {
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





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  calculateRevalidateTime,
};
