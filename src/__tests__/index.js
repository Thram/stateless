import 'react-testing-library/cleanup-after-each';
import { render, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import React from 'react';
import { Stateless, StoreProvider, Store } from '../index';

const click = element =>
  fireEvent(
    element,
    new MouseEvent('click', {
      bubbles: true, // click events must bubble for React to see it
      cancelable: true,
    }),
  );

describe('Tests', () => {
  it('Stateless', async () => {
    let state = 'created';
    const { getByTestId } = render(
      <Stateless
        value={{ name: 'Thram' }}
        events={{
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
        }}
      >
        {({ value, change }) => (
          <div>
            <h2 data-testid="state">{value.name}</h2>
            <button
              onClick={() => change({ name: 'Aglarik' })}
              data-testid="button"
            >
              Button
            </button>
          </div>
        )}
      </Stateless>,
    );
    expect(getByTestId('state')).toHaveTextContent('Thram');
    click(getByTestId('button'));
    expect(getByTestId('state')).toHaveTextContent('Aglarik');
  });

  const Counter = () => (
    <Store state="counter">
      {({ value, change }) => (
        <div>
          <h2 data-testid="state">{value}</h2>
          <button onClick={() => change(value + 1)} data-testid="button">
            Button
          </button>
        </div>
      )}
    </Store>
  );

  it('Store', async () => {
    let state = 'created';
    const { getByTestId } = render(
      <StoreProvider
        value={{ counter: 6 }}
        events={{
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
        }}
      >
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
});
