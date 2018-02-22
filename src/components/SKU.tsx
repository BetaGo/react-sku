import * as React from 'react';
import { Button } from 'antd';

import SKUGroup from './SkuGroup';

import { SKU, SKUTree, SKUItem, BasicItem } from '../types';

export type SKUSelectProps = {
  maxSize: number,
  value: SKU,
  skuTree: SKUTree,
  onChange: (data: SKU) => void,
  onFetchGroup: () => Promise<Array<BasicItem>>,
  onFetchSKU: (groupName: string) => Promise<Array<BasicItem>>,
  onCreateGroup: (groupName: string) => Promise<string>,
  onCreateSKU: (SKUName: string) => Promise<string>,
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
            onCreateGroup={this.props.onCreateGroup}
            onCreateSKU={this.props.onCreateSKU}
            onFetchSKU={this.props.onFetchSKU}
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