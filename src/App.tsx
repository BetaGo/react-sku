import * as React from 'react';

import SKUSelect from './components/SKUSelect';
import { SKUValue } from './types';

import { onCreateGroup, onCreateSKU, onFetchGroup, onFetchSKU } from './utils/fakeAPI';
// const initialValue: SKUValue = []; 

type AppState = {
  skuValue: SKUValue,
};
class App extends React.Component<{}, AppState> {
  state = {
    skuValue: [],
  };

  handleChange = (data: SKUValue) => {
    this.setState({
      skuValue: data,
    });
  }
  render() {
    const { skuValue } = this.state;
    return (
      <div>
        <SKUSelect
          value={skuValue}
          onChange={this.handleChange}
          onFetchGroup={onFetchGroup}
          onFetchSKU={onFetchSKU}
          onCreateGroup={onCreateGroup}
          onCreateSKU={onCreateSKU}
        />
      </div>
    );
  }
}

export default App;
