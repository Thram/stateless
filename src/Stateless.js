import { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Stateless extends PureComponent {
  static defaultProps = {
    value: {},
    events: {},
    reducer: (state, change) => change,
  };

  static propTypes = {
    value: PropTypes.shape({}),
    events: PropTypes.shape({
      beforeMount: PropTypes.func,
      afterMount: PropTypes.func,
      beforeChange: PropTypes.func,
      afterChange: PropTypes.func,
    }),
    children: PropTypes.func.isRequired,
    reducer: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { value, events } = props;
    this.state = value;
    if (events.beforeMount) events.beforeMount({ value });
  }
  componentDidMount() {
    const { afterMount } = this.props.events;
    if (afterMount) afterMount({ value: this.state, change: this.updateState });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value)
      this.updateState(this.props.value);
  }
  updateState = (change = {}) => {
    const { events, reducer } = this.props;
    const prevState = { ...this.state };
    const nextState = reducer(prevState, change);
    if (events.beforeChange) events.beforeChange(nextState, prevState);
    this.setState(nextState);
    if (events.afterChange) events.afterChange(nextState, prevState);
  };
  render = () =>
    this.props.children({ value: this.state, change: this.updateState });
}
