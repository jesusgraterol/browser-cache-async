/* eslint-disable no-console */
import { IIndexedDBStore, IndexedDBStore, IRecordID } from 'browser-keyval-stores';
import { IQueryOptions, IProcessedQueryOptions, IWrappedData } from './shared/types.js';
import { unwrapData } from './utils/index.js';
import { IBrowserCache } from './types.js';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Browser Cache
 * Object in charge of managing the caching of data in the browser.
 */
class BrowserCache<T> implements IBrowserCache<T> {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // the store that will be used to cache the data
  private __store: IIndexedDBStore<IWrappedData<T>>;

  // if enabled, the cache will log debug information
  private __debugMode: boolean;





  /* **********************************************************************************************
   *                                         CONSTRUCTOR                                          *
   ********************************************************************************************** */
  constructor(id: string, debugMode: boolean = false) {
    this.__store = new IndexedDBStore<IWrappedData<T>>(id);
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
      return unwrapData(await this.__store.get(id));
    } catch (e) {
      if (this.__debugMode) {
        console.error(e);
      }
      return undefined;
    }
  }

  public async run(options: IQueryOptions<T>): Promise<T | undefined> {
    // check if the record exists
    const cached = await this.__get(options.id);
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
