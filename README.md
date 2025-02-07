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

...:

```typescript
import { BrowserCache } from 'browser-cache-async';

...
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

  type IQueryOptions<T> = {
    // the record's identifier
    id?: IRecordID;

    // the function that will be invoked to retrieve the data
    query: () => Promise<T>;

    // the function that will be invoked to evaluate if the data should be cached. If not provided,
    // the data will always be cached.
    cacheIf?: (id: IRecordID, record: T) => Promise<boolean>;

    // the number of milliseconds the data will be fresh for before becoming stale. If not provided,
    // the data will become stale after 1 day.
    revalidate?: StringValue | number;
  };

  // the result of processing the query options object passed by the developer
  type IProcessedQueryOptions<T> = IQueryOptions<T> & { revalidate: number };
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