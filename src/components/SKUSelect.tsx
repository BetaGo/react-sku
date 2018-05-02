import * as React from 'react';
import { Button } from 'antd';

import SKUGroup from './SKUGroup';

import { SKUValue, SKUTree, SKUItem, BasicItem } from '../types';

import './Style.css';

export type SKUSelectProps = {
  maxSize?: number,
  value: SKUValue,
  onChange: (data: SKUValue) => void,
  onFetchGroup: () => Promise<Array<BasicItem>>,
  onFetchSKU: (groupId: number) => Promise<Array<BasicItem>>,
  onCreateGroup: (groupName: string) => Promise<BasicItem>,
  onCreateSKU: (SKUName: string, groupId: number) => Promise<BasicItem>,
};

export type SKUSelectState = {
  data: SKUValue,
  skuTree: SKUTree,
};

class SKUSelect extends React.Component<SKUSelectProps, SKUSelectState> {
  constructor(props: SKUSelectProps) {
    super(props);
    this.state = {
      skuTree: [],
      data: props.value,
    };
  }

  componentDidMount() {
    this.props.onFetchGroup().then(skuTree => {
      this.setState({
        skuTree: skuTree,
      });
    });
  }

  componentWillReceiveProps(nextProps: SKUSelectProps) {
    this.setState({
      data: nextProps.value,
    });
  }

  handleAddSKU = () => {
    const { data } = this.state;
    const newData = [
      ...data,
      {
        id: undefined, 
        text: '',
        leaf: [],
      }
    ];
    this.setState({
      data: newData,
    });
  }

  rebuildSKU = (skuItem: SKUItem, index: number) => {
    const { data, skuTree } = this.state;
    data[index] = skuItem;
    if (skuItem.id && !skuTree.some(item => item.id === skuItem.id)) {
      skuTree.push(skuItem);
      this.setState({
        skuTree: [...skuTree],
      });
    }
    this.setState({
      data: [...data],
    });
    this.props.onChange(data);
  }

  handleDelSku = (index: number) => {
    const { data } = this.state;
    const newData = data.filter((item, idx) => idx !== index);
    this.setState({
      data: newData,
    });
    this.props.onChange(newData);
  }

  render() {
    const { maxSize = 3 } = this.props;
    const { skuTree, data } = this.state;
    return (
      <div>
        {data.map((item, index) => (
          <SKUGroup
            key={item.id || `key-${index}`}
            index={index}
            skuItem={item}
            skuTree={skuTree}
            selectedSKU={data}
            onSKUChange={this.rebuildSKU}
            onSKUDelete={() => this.handleDelSku(index)}
            onCreateGroup={this.props.onCreateGroup}
            onCreateSKU={this.props.onCreateSKU}
            onFetchSKU={this.props.onFetchSKU}
          />
        ))}
        {data.length < maxSize && (
          <Button onClick={this.handleAddSKU}>
            添加规格
          </Button>
        )}
      </div>
    );
  }
}

export default SKUSelect;