import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Stateless from './Stateless';

const Context = React.createContext();

class Provider extends PureComponent {
  static defaultProps = Stateless.defaultProps;
  static propTypes = {
    ...Stateless.propTypes,
    children: PropTypes.node.isRequired,
  };

  afterChange = (nextState, prevState) => {
    const { persistor, events = {} } = this.props;
    persistor.set(nextState);
    if (events.afterChange) events.afterChange(nextState, prevState);
  };
  render = () => {
    const { children, persistor, events, value, ...props } = this.props;
    const appEvents = persistor
      ? { ...events, afterChange: this.afterChange }
      : events;
    this.value = value;
    if (!this.init && persistor && persistor.get()) {
      this.init = true;
      this.value = persistor.get();
    }

    return (
      <Stateless value={this.value} events={appEvents} {...props}>
        {({ value, change }) => (
          <Context.Provider value={{ store: value, change }}>
            {children}
          </Context.Provider>
        )}
      </Stateless>
    );
  };
}
class Consumer extends PureComponent {
  static propTypes = {
    state: PropTypes.string,
    children: PropTypes.func.isRequired,
  };
  render = () => {
    const { state, children, ...props } = this.props;
    return (
      <Context.Consumer>
        {({ store, change }) =>
          children({
            value: state ? store[state] : store,
            change: value =>
              change(
                state ? { ...store, [state]: value } : { ...store, ...value },
              ),
            ...props,
          })
        }
      </Context.Consumer>
    );
  };
}

export { Provider, Consumer };
