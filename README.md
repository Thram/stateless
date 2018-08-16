# @thram/stateless

> React components for Application and Component state management using render
> props and Context API

[![NPM](https://img.shields.io/npm/v/@thram/stateless.svg)](https://www.npmjs.com/package/@thram/stateless)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @thram/stateless
```

## Usage

### Stateless

```jsx
import React from 'react';
import { Stateless } from '@thram/stateless';

const DropDown = () => (
  <Stateless value={{ isOpened: false }}>
    {({ value, change }) => (
      <div>
        <div>
          Menu <i onClick={() => change({ isOpened: !value.isOpened })}>{value.isOpened ? 👆 : 👇 }</i>
        </div>
        {value.isOpened && (
          <ul>
            <li>Menu 1</li>
            <li>Menu 2</li>
            <li>Menu 3</li>
          </ul>
        )}
      </div>
    )}
  </Stateless>
);
```

### Application Store

```jsx
import React, { PureComponent } from 'react';
import { StoreProvider, Store } from '@thram/stateless';

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

## TODO

- Improve docs
- Add examples for persisting data
- Ask for feedback!

## License

MIT © [Thram](https://github.com/Thram)
