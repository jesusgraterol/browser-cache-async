import { StringValue } from 'ms';
import { IRecordID } from 'browser-keyval-stores';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Query Options
 * Object in charge of controlling how the query is executed and cached.
 */
type IQueryOptions<T> = {
  // the record's identifier
  id?: IRecordID;

  // the function that will be invoked to retrieve the data
  query: () => Promise<T>;

  // the function that will be invoked to evaluate if the data should be cached. If not provided,
  // the data will always be cached.
  cacheIf?: ((id: IRecordID, data: T) => Promise<boolean>) | ((id: IRecordID, data: T) => boolean);

  // the number of milliseconds the data will be fresh for before becoming stale. If not provided,
  // the data will become stale after 1 day.
  revalidate?: StringValue | number;
};

/**
 * Processed Query Options
 * The result of processing the query options object passed by the developer.
 */
type IProcessedQueryOptions<T> = IQueryOptions<T> & { revalidate: number };





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IQueryOptions,
  IProcessedQueryOptions,
};
