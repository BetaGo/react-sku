import * as React from 'react';
import { Button } from 'antd';

import SKUGroup from './SkuGroup';

import { SKU, SKUTree, SKUItem } from '../types';

export type SKUSelectProps = {
  onChange: (data: SKU) => void,
  maxSize: number,
  value: SKU,
  skuTree: SKUTree,
};

export type SKUSelectState = {
  data: SKU,
  skuTree: SKUTree,
};

class SKUSelect extends React.Component<SKUSelectProps, SKUSelectState> {
  constructor(props: SKUSelectProps) {
    super(props);
    this.state = {
      skuTree: props.skuTree,
      data: props.value,
    };
  }

  componentWillReceiveProps(nextProps: SKUSelectProps) {
    this.setState({
      skuTree: nextProps.skuTree,
      data: nextProps.value,
    });
  }

  addSKU = () => {
    const { data } = this.state;
    const newData = [
      ...data,
      {
        id: -1,
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
    if (data[index]) {
      data[index] = skuItem;
    } else {
      data.push(skuItem);
    }
    if (!skuTree.some(item => item.id === skuItem.id)) {
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

  delSku = (index: number) => {
    const { data } = this.state;
    const newData = data.filter((item, idx) => idx !== index);
    this.setState({
      data: newData,
    });
  }

  render() {
    const { maxSize } = this.props;
    const { skuTree, data } = this.state;
    return (
      <div>
        {data.map((item, index) => (
          <SKUGroup
            key={index}
            index={index}
            sku={item}
            skuTree={skuTree}
            onSKUChange={this.rebuildSKU}
            onSKUDelete={this.delSku.bind(this, index)}
          />
        ))}
        {data.length < maxSize && (
          <Button onClick={this.addSKU}>
            添加规格
          </Button>
        )}
      </div>
    );
  }

}

export default SKUSelect;