import * as React from 'react';

import SKUSelect from './components/SKUSelect';
import { SKUValue } from './types';

import { onCreateGroup, onCreateSKU, onFetchGroup, onFetchSKU } from './utils/fakeAPI';
// const initialValue: SKUValue = []; 
class App extends React.Component {
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
          skuTree={[]}
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
