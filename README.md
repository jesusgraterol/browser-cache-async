# Browser Cache Async

The `browser-cache-async` package  provides a highly customizable, asynchronous caching system for client-side data management. Leveraging the power of the browser's [`IndexedDB`](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), it enables efficient storage and retrieval of API responses, significantly reducing network latency and improving application performance. 

With flexible configuration options for cache lifecycles, expiration strategies, and data management policies, `browser-cache-async` is the ideal solution for developers looking to optimize web applications, enhance offline capabilities, and deliver a smoother user experience.





</br>

## Getting Started

Install the package:
```bash
npm install -S browser-cache-async
```


## Usage

Cache the result of a `fetch` request:

```typescript
import { BrowserCache } from 'browser-cache-async';
import { IProduct } from './types.js';

const cache = new BrowserCache<IProduct>('products');

// retrieve and cache the product. If revalidate is not provided, the data becomes stale after 24 hours
const id = 1;
const product = await cache.run({
  id,
  query: async () => {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    return res.json();
  }
});
// {
//   id: 1,
//   title: '...',
//   price: '...',
//   category: '...',
//   description: '...',
//   image: '...'
// }
```

Cache an article for 2 weeks if it has been published:

```typescript
import { BrowserCache } from 'browser-cache-async';
import { BackendService } from './backend.js';
import { IArticle } from './types.js';

const cache = new BrowserCache<IArticle>('articles');

const id = 'db6d9d01-8d67-4765-8baa-2210cbc0470e';
const article = await cache.run({
  id,
  query: async () => BackendService.getArticle(id),
  cacheIf: (id: IRecordID, data: IArticle) => data.isDraft === false,
  revalidate: '2 weeks'
});
// {
//   id: 'db6d9d01-8d67-4765-8baa-2210cbc0470e',
//   heading: '...',
//   subHeading: '...',
//   content: '...',
//   isDraft: false
// }
```




### Types

<details>
  <summary><code>IRecordID</code></summary>

  The identifier used to manage records. The store behaves differently based on the type:
  - `undefined`: the data will be stored at the root of the store
  - `string` | `number`: the value will be coerced into a string and can be used to locate the data
  ```typescript
  type IRecordID = undefined | string | number;
  ```

  **Note:** this type is exposed by the [`browser-keyval-stores`](https://github.com/jesusgraterol/browser-keyval-stores) package
</details>

<details>
  <summary><code>StringValue</code></summary>

  The template literal types that prevents developers from passing invalid strings to the `ms` function.
  ```typescript
  type Unit =
      | "Years"
      | "Year"
      | "Yrs"
      | "Yr"
      | "Y"
      | "Weeks"
      | "Week"
      | "W"
      | "Days"
      | "Day"
      | "D"
      | "Hours"
      | "Hour"
      | "Hrs"
      | "Hr"
      | "H"
      | "Minutes"
      | "Minute"
      | "Mins"
      | "Min"
      | "M"
      | "Seconds"
      | "Second"
      | "Secs"
      | "Sec"
      | "s"
      | "Milliseconds"
      | "Millisecond"
      | "Msecs"
      | "Msec"
      | "Ms";

  type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

  type StringValue =
      | `${number}`
      | `${number}${UnitAnyCase}`
      | `${number} ${UnitAnyCase}`;
  ```

  **Note:** this type is exposed by the [`ms`](https://github.com/vercel/ms) package
</details>

<details>
  <summary><code>IQueryOptions<T></code></summary>

  Object in charge of controlling how the query is executed and cached.
  ```typescript
  import { StringValue } from 'ms';
  import { IRecordID } from 'browser-keyval-stores';

  type ICacheIfFn<T> =
    ((id: IRecordID, data: T) => Promise<boolean>) | ((id: IRecordID, data: T) => boolean);

  type IQueryOptions<T> = {
    // the record's identifier
    id?: IRecordID;

    // the function that will be invoked to retrieve the data
    query: () => Promise<T>;

    // the function that will be invoked to evaluate if the data should be cached. If not provided,
    // the data will always be cached.
    cacheIf?: ICacheIfFn;

    // the number of milliseconds the data will be fresh for before becoming stale. If not provided,
    // the data will become stale after 1 day.
    revalidate?: StringValue | number;
  };

  // the result of processing the query options object passed by the developer
  type IProcessedQueryOptions<T> = IQueryOptions<T> & { revalidate: number };
  ```
</details>

<details>
  <summary><code>IBrowserCache</code></summary>

  Object in charge of managing the caching of data in the browser.
  ```typescript
  interface IBrowserCache<T> {
    // properties
    // ...

    // actions
    run: (options: IQueryOptions<T>) => Promise<T | undefined>;
    revalidate(id?: IRecordID): Promise<void>;
  }
  ```
</details>





<br/>

## Built With

- TypeScript





<br/>

## Tests

```bash
# integration tests
npm run test:integration

# unit tests
npm run test:unit
```





<br/>

## License

[MIT](https://choosealicense.com/licenses/mit/)





<br/>

## Deployment

Install dependencies:
```bash
npm install
```


Build the library:
```bash
npm start
```


Publish to `npm`:
```bash
npm publish
```