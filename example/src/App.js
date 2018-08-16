import React, { PureComponent } from 'react';
import { StoreProvider, createPersistor } from 'thram-stateless';
import Counter from './Counter';
import './index.css';

let timer;
const redIfPair = ({ counter }) =>
  new Promise(resolve => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(
      () => resolve(counter % 2 === 0 ? 'red' : 'black'),
      1000,
    );
  });

class App extends PureComponent {
  state = { forcedCounter: 1 };
  constructor(props) {
    super(props);
    this.valueRef = React.createRef();
  }

  changeTo10 = () => this.setState({ forcedCounter: 10 });
  beforeMount = ({ value }) => console.log(value); // eslint-disable-line no-console
  afterMount = ({ value, change }) => change({ counter: value.counter + 1 });
  beforeChange = async ({ counter }) => {
    const color = await redIfPair({ counter });
    this.setState({ color });
  };
  afterChange = ({ counter }) => {
    this.setState({ forcedCounter: counter });
  };
  render = () => (
    <StoreProvider
      persistor={createPersistor('app')}
      value={{ counter: this.state.forcedCounter }}
      events={{
        beforeMount: this.beforeMount,
        afterMount: this.afterMount,
        beforeChange: this.beforeChange,
        afterChange: this.afterChange,
      }}
    >
      <div className="App">
        <h1>Stateless components using the render props pattern</h1>

        <Counter color={this.state.color} />
        <button onClick={this.changeTo10}>Set To 10!</button>
      </div>
    </StoreProvider>
  );
}

export default App;
