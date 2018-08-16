/* eslint-disable react/prop-types */
import 'react-testing-library/cleanup-after-each';
import { render, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import React from 'react';
import { Stateless, StoreProvider, Store, createPersistor } from '../index';

const click = element =>
  fireEvent(
    element,
    new MouseEvent('click', {
      bubbles: true, // click events must bubble for React to see it
      cancelable: true,
    }),
  );

const trackEvents = () => {
  let state = 'created';
  return {
    beforeMount: () => {
      expect(state).toBe('created');
      state = 'beforeMount';
    },
    afterMount: () => {
      expect(state).toBe('beforeMount');
      state = 'afterMount';
    },
    beforeChange: () => {
      expect(['afterMount', 'afterChange']).toContain(state);
      state = 'beforeChange';
    },
    afterChange: () => {
      expect(state).toBe('beforeChange');
      state = 'afterChange';
    },
  };
};

const Display = ({ value = '', onClick }) => (
  <div>
    <h2 data-testid="state">{value}</h2>
    <button data-testid="button" onClick={onClick} />
  </div>
);

describe('Tests', () => {
  it('Stateless', async () => {
    const { getByTestId } = render(
      <Stateless value={{ name: 'Thram' }} events={trackEvents()}>
        {({ value, change }) => (
          <Display
            value={value.name}
            onClick={() => change({ name: 'Aglarik' })}
          />
        )}
      </Stateless>,
    );
    expect(getByTestId('state')).toHaveTextContent('Thram');
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent('Aglarik');
  });

  it('Stateless - with Reducer', async () => {
    const { getByTestId } = render(
      <Stateless
        value={{ counter: 1 }}
        reducer={(state, change) => ({ counter: change.counter + 1 })}
        events={trackEvents()}
      >
        {({ value, change }) => (
          <Display
            value={value.counter}
            onClick={() => change({ counter: value.counter + 1 })}
          />
        )}
      </Stateless>,
    );
    expect(getByTestId('state')).toHaveTextContent(1);
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent(3);
    click(getByTestId('button'));
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent(7);
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent(9);
  });

  const Counter = () => (
    <Store state="counter">
      {({ value, change }) => (
        <Display value={value} onClick={() => change(value + 1)} />
      )}
    </Store>
  );

  const ReducedCounter = () => (
    <Store state="counter" reducer={(state, change) => change + 1}>
      {({ value, change }) => (
        <Display value={value} onClick={() => change(value + 1)} />
      )}
    </Store>
  );

  it('Store', async () => {
    const { getByTestId } = render(
      <StoreProvider value={{ counter: 6 }} events={trackEvents()}>
        <Counter />
      </StoreProvider>,
    );
    expect(getByTestId('state')).toHaveTextContent(6);
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent(7);
    click(getByTestId('button'));
    click(getByTestId('button'));
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent(10);
  });

  it('Store - with Reducer', async () => {
    const { getByTestId } = render(
      <StoreProvider value={{ counter: 6 }} events={trackEvents()}>
        <ReducedCounter />
      </StoreProvider>,
    );
    expect(getByTestId('state')).toHaveTextContent(6);
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent(8);
    click(getByTestId('button'));
    click(getByTestId('button'));
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent(14);
  });

  it('StoreProvider - with Reducer', async () => {
    const { getByTestId } = render(
      <StoreProvider
        reducer={(state, change) => ({ counter: change.counter + 1 })}
        value={{ counter: 6 }}
      >
        <ReducedCounter />
      </StoreProvider>,
    );
    expect(getByTestId('state')).toHaveTextContent(6);
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent(9);
    click(getByTestId('button'));
    click(getByTestId('button'));
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent(18);
  });

  it('StoreProvider - with Persistor', async () => {
    const persistor = createPersistor('app');
    persistor.set({ counter: 5 });
    const { getByTestId } = render(
      <StoreProvider persistor={persistor} value={{ counter: 6 }}>
        <Counter />
      </StoreProvider>,
    );
    expect(getByTestId('state')).toHaveTextContent(5);
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent(6);
    click(getByTestId('button'));
    click(getByTestId('button'));
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent(9);
  });

  it('Multiple StoreProviders', async () => {
    const persistor = createPersistor('app');
    persistor.set({ counter: 5 });
    const { getByTestId } = render(
      <div>
        <StoreProvider persistor={persistor} value={{ counter: 6 }}>
          <Counter />
        </StoreProvider>
        <StoreProvider persistor={persistor} value={{ counter: 6 }}>
          <Store state="counter">
            {({ value, change }) => (
              <div>
                <h2 data-testid="state-2">{value}</h2>
                <button
                  data-testid="button-2"
                  onClick={() => change(value + 2)}
                />
              </div>
            )}
          </Store>
        </StoreProvider>
      </div>,
    );
    expect(getByTestId('state')).toHaveTextContent(5);
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent(6);
    click(getByTestId('button'));
    click(getByTestId('button'));
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent(9);

    expect(getByTestId('state-2')).toHaveTextContent(5);
    click(getByTestId('button-2'));
    expect(getByTestId('state-2')).toHaveTextContent(7);
    click(getByTestId('button-2'));
    click(getByTestId('button-2'));
    click(getByTestId('button-2'));
    expect(getByTestId('state-2')).toHaveTextContent(13);

    expect(getByTestId('state')).toHaveTextContent(9);
  });
});
