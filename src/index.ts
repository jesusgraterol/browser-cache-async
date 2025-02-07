/* eslint-disable no-console */
import { IIndexedDBStore, IndexedDBStore, IRecordID } from 'browser-keyval-stores';
import { IQueryOptions, IProcessedQueryOptions } from './shared/types.js';
import { IBrowserCache } from './types.js';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

class BrowserCache<T> implements IBrowserCache<T> {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // the store that will be used to cache the data
  private __store: IIndexedDBStore<T>;

  // if enabled, the cache will log debug information
  private __debugMode: boolean;





  /* **********************************************************************************************
   *                                         CONSTRUCTOR                                          *
   ********************************************************************************************** */
  constructor(id: string, debugMode: boolean = false) {
    this.__store = new IndexedDBStore<T>(id);
    this.__debugMode = debugMode;
  }




  /* **********************************************************************************************
   *                                           METHODS                                            *
   ********************************************************************************************** */

  /**
   * Retrieves and unwraps the data from the cache. It returns undefined if the data is not found or
   * is stale.
   * Note: this is a stable method, it will not throw errors.
   * @param id
   * @returns Promise<T | undefined>
   */
  private async __get(id: IRecordID): Promise<T | undefined> {
    try {
      const wrappedData = await this.__store.get(id);

      // otherwise, return the data
      return undefined;
    } catch (e) {
      if (this.__debugMode) {
        console.error(e);
      }
      return undefined;
    }
  }

  public run(options: IQueryOptions<T>): Promise<T | undefined> {
    // ...
    return options.query();
  }
}




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type IQueryOptions,
  type IProcessedQueryOptions,
  type IBrowserCache,

  // classes
  BrowserCache,
};
