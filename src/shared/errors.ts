

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
type IError = 'INVALID_REVALIDATE_VALUE' | 'INVALID_QUERY_FUNCTION';
const ERRORS: { [key in IError]: IError } = {
  INVALID_REVALIDATE_VALUE: 'INVALID_REVALIDATE_VALUE',
  INVALID_QUERY_FUNCTION: 'INVALID_QUERY_FUNCTION',
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  ERRORS,
};
