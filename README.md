# thram-stateless

> React components for Application and Component state management using render
> props and Context API

[![NPM](https://img.shields.io/npm/v/thram-stateless.svg)](https://www.npmjs.com/package/thram-stateless)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save thram-stateless
```

## Components

### `<Stateless />`

Add dynamic behaviour to your components without using `state`.

| prop    | type     | description                                                |
| ------- | -------- | ---------------------------------------------------------- |
| value   | Object   | Component value                                            |
| events  | Object   | `beforeMount`, `afterMount`, `beforeChange`, `afterChange` |
| reducer | function | Reducer function                                           |

### `<StoreProvider />`

Add dynamic behaviour to a group of components using a `store` that can be consumed by `<Store />`.

| prop      | type     | description                                                |
| --------- | -------- | ---------------------------------------------------------- |
| value     | Object   | Component value                                            |
| events    | Object   | `beforeMount`, `afterMount`, `beforeChange`, `afterChange` |
| reducer   | function | Reducer function                                           |
| persistor | Object   | Persistor API to perist data after change and rehydrate    |

### `<Store />`

Store consumer.

| prop    | type     | description                                         |
| ------- | -------- | --------------------------------------------------- |
| state   | String   | Key of the value you want to connect in the `store` |
| reducer | function | Reducer function                                    |

## Usage

### Stateless

```jsx
import React from 'react';
import { Stateless } from 'thram-stateless';

const DisplayDropDown = ({ isOpened, toggle }) => (
  <div>
    <div>
      Menu <i onClick={toggle}>{isOpened ? '👆' : '👇'}</i>
    </div>
    {isOpened && (
      <ul>
        <li>Menu 1</li>
        <li>Menu 2</li>
        <li>Menu 3</li>
      </ul>
    )}
  </div>
);

const DropDown = () => (
  <Stateless value={{ isOpened: false }}>
    {({ value, change }) => (
      <DisplayDropDown
        isOpened={value.isOpened}
        toggle={() => change({ isOpened: !value.isOpened })}
      />
    )}
  </Stateless>
);
```

### Application Store

`StoreProvider` implements `Sateless` under the hood so they have similar APIs.

```jsx
import React, { PureComponent } from 'react';
import { StoreProvider, Store } from 'thram-stateless';

const AppCounter = () => (
  <Store state="counter">
    {({ value, change }) => (
      <div>
        <h2>{value}</h2>
        <button onClick={() => change(value + 1)}>Button</button>
      </div>
    )}
  </Store>
);

class App extends PureComponent {
  render = () => (
    <StoreProvider value={{ counter: 6 }}>
        <Counter />
      </StoreProvider>,
  );
}
```

## Events

`StoreProvider` and `Stateless` has a very simple event lifecyle: `beforeMount`,
`afterMount`, `beforeChange`, `afterChange`

```jsx
const App = () => (
  <StoreProvider
    events={{
      beforeMount: value => {
        /* .. */
      },
      afterMount: (value, change) => {
        /* ... */
      },
      beforeChange: (nextValue, prevValue) => {
        /* ... */
      },
      afterChange: (nextValue, prevValue) => {
        /* ... */
      },
    }}
  >
    <Counter />
  </StoreProvider>
);
```

```jsx
const DropDown = () => (
  <Stateless
    value={{ isOpened: false }}
    events={{
      beforeMount: value => {
        /* .. */
      },
      afterMount: (value, change) => {
        /* ... */
      },
      beforeChange: (nextValue, prevValue) => {
        /* ... */
      },
      afterChange: (nextValue, prevValue) => {
        /* ... */
      },
    }}
  >
    {({ value, change }) => (
      <DisplayDropDown
        isOpened={value.isOpened}
        toggle={() => change({ isOpened: !value.isOpened })}
      />
    )}
  </Stateless>
);
```

## Reducer

`StoreProvider`, `Store` and `Stateless` can all handle the reducer pattern to
reduce the value before update:

```jsx
const ReducedStoreApp = () => (
  <StoreProvider reducer={(state, value) => ({ counter: value.counter + 1 })}>
    <Counter />
  </StoreProvider>
);
```

```jsx
const ReducedGlobalCounter = () => (
  <Store state="counter" reducer={(state, value) => value + 1}>
    {({ value, change }) => (
      <Display value={value} onClick={() => change(value + 1)} />
    )}
  </Store>
);
```

```jsx
const ReducedCounter = () => (
  <Stateless
    value={{ counter: 1 }}
    reducer={(state, value) => ({ counter: value.counter + 1 })}
  >
    {({ value, change }) => (
      <Display
        value={value.counter}
        onClick={() => change({ counter: value.counter + 1 })}
      />
    )}
  </Stateless>
);
```

## Persistor

You can pass a Persistor API to the `StoreProvider` to persist/rehydrate the data.

You can use our simple implementation `createPeristor` that uses `localStorage/sessionStorage` or you can implement yours.

The Persistor API should have the following structure:
```js
{
  get: () => { /* To rehydrate */ },
  set: () => { /* To persist data */ },
  remove: () => { /* To remove a value */ },
  clear: () => { /* To destroy the persisted data */ },
}
```

### Example:
```jsx
import React, { PureComponent } from 'react';
import { StoreProvider, Store, createPersistor } from 'thram-stateless';

const persistor = createPersistor('app');

const AppCounter = () => (
  <Store state="counter">
    {({ value, change }) => (
      <div>
        <h2>{value}</h2>
        <button onClick={() => change(value + 1)}>Button</button>
      </div>
    )}
  </Store>
);

class App extends PureComponent {
  render = () => (
    <StoreProvider persistor={persistor} value={{ counter: 6 }}>
      <Counter />
    </StoreProvider>,
  );
}
```

## TODO

- Ask for feedback!

## License

MIT © [Thram](https://github.com/Thram)
