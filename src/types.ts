import { IRecordID } from 'browser-keyval-stores';
import { IQueryOptions } from './shared/types.js';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Browser Cache
 * Object in charge of managing the caching of data in the browser.
 */
interface IBrowserCache<T> {
  // properties
  // ...

  // actions
  run: (options: IQueryOptions<T>) => Promise<T>;
  revalidate(id?: IRecordID): Promise<void>;
}





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IBrowserCache,
};
