/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { Store } from 'thram-stateless';

class Counter extends PureComponent {
  state = { forcedCounter: 1 };
  constructor(props) {
    super(props);
    this.valueRef = React.createRef();
  }
  render = () => {
    const { color } = this.props;
    return (
      <Store state="counter">
        {({ value, change }) => {
          return (
            <div>
              <h2
                ref={this.valueRef}
                style={{ color, transition: 'color 1s ease' }}
              >
                Counter: {value}
              </h2>
              <div>
                <button onClick={() => change(value + 1)}>+1</button>
                <button onClick={() => change(value - 1)}>-1</button>
              </div>
            </div>
          );
        }}
      </Store>
    );
  };
}

export default Counter;
