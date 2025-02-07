import { IIndexedDBStore, IndexedDBStore } from 'browser-keyval-stores';
import { IQueryOptions } from './shared/types.js';
import { IBrowserCache } from './types.js';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

class BrowserCache<T> implements IBrowserCache<T> {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // the store that will be used to cache the data
  private store: IIndexedDBStore<T>;





  /* **********************************************************************************************
   *                                         CONSTRUCTOR                                          *
   ********************************************************************************************** */
  constructor(id: string) {
    this.store = new IndexedDBStore<T>(id);
  }




  /* **********************************************************************************************
   *                                           METHODS                                            *
   ********************************************************************************************** */

  public run(options: IQueryOptions<T>): Promise<T | undefined> {
    // ...
    return options.queryFn();
  }
}




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type IQueryOptions,
  type IBrowserCache,

  // classes
  BrowserCache,
};
