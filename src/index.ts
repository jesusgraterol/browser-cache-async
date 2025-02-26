/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
/* eslint-disable no-lonely-if */
import { IIndexedDBStore, IndexedDBStore, IRecordID } from 'browser-keyval-stores';
import {
  ICacheIfFn,
  IStringValue,
  IQueryOptions,
  IProcessedQueryOptions,
  IWrappedData,
} from './shared/types.js';
import {
  buildQueryOptions,
  canQueryBeCached,
  unwrapData,
  wrapData,
} from './utils/index.js';
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
      if (this.__debugMode) console.error(`${this.__store.id}.__get(${id}) ->`, e);
      return undefined;
    }
  }

  /**
   * Stores the data in the cache.
   * Note: this is a stable method, it will not throw errors.
   * @param id
   * @param data
   * @param revalidate
   * @returns Promise<void>
   */
  private async __set(id: IRecordID, data: T, revalidate: number): Promise<void> {
    try {
      await this.__store.set(id, wrapData(data, revalidate));
    } catch (e) {
      if (this.__debugMode) console.error(`${this.__store.id}.__set(${id}, ...) ->`, e);
    }
  }

  /**
   * Verifies if the query has already been cached and that its data is still fresh. Otherwise, it
   * executes the query and caches the data.
   * @param options
   * @returns Promise<T>
   * @throws
   * - INVALID_QUERY_FUNCTION: If the query function is not a function.
   * - INVALID_REVALIDATE_VALUE: If the revalidate value is not a valid number or StringValue.
   */
  public async run(options: IQueryOptions<T>): Promise<T> {
    // build the options
    const { id, query, cacheIf, revalidate } = buildQueryOptions(options);

    // check if the record exists - if so, return early
    const cached = await this.__get(id);
    if (cached) {
      if (this.__debugMode) console.log(`${this.__store.id} -> CACHE_HIT: ${id}`, cached);
      return cached;
    }
    if (this.__debugMode) console.log(`${this.__store.id} -> CACHE_MISS: ${id}`);

    // execute the query and cache the data
    const data = await query();
    if (await canQueryBeCached(id, data, cacheIf)) {
      await this.__set(id, data, revalidate);
      if (this.__debugMode) console.log(`${this.__store.id} -> CACHE_SET: ${id}`, data);
    } else {
      if (this.__debugMode) console.log(`${this.__store.id} -> CACHE_SKIP: ${id}`, data);
    }

    // finally, return the data
    return data;
  }

  /**
   * Deletes a record from the cache - forcing a revalidation the next time it is retrieved.
   * Note: this is a stable method, it will not throw errors.
   * @param id
   * @returns Promise<void>
   */
  public async revalidate(id?: IRecordID): Promise<void> {
    try {
      await this.__store.del(id);
    } catch (e) {
      if (this.__debugMode) console.error(`${this.__store.id}.revalidate(${id}) ->`, e);
    }
  }
}





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type ICacheIfFn,
  type IStringValue,
  type IQueryOptions,
  type IProcessedQueryOptions,
  type IBrowserCache,

  // classes
  BrowserCache,
};
