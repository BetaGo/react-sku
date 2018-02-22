import * as React from 'react';
import { Select, message, Button, Row, Col } from 'antd';

import { SKU, SKUItem, SKUTree, BasicItem } from '../types';

type SKUGroupProps = {
  index: number,
  sku: SKUItem,
  skuTree: SKUTree,
  onSKUChange: (skuItem: SKUItem, index: number) => void,
  onSKUDelete: () => void;
  onFetchSKU: (groupName: string) => Promise<Array<BasicItem>>,
  onCreateGroup: (groupName: string) => Promise<string>,
  onCreateSKU: (SKUName: string) => Promise<string>,
};

type SKUGroupState = {
  selectedSKUText: string,
};

class SKUGroup extends React.Component<SKUGroupProps, SKUGroupState> {
  constructor(props: SKUGroupProps) {
    super(props);
    this.state = {
      selectedSKUText: '',
    };
  }

  handleSelectChange = (value: string) => {
    this.setState({
      selectedSKUText: value,
    });
  }

  handleOnBlur = () => {
    const { skuTree, index } = this.props;
    const { selectedSKUText }  = this.state;
    if (selectedSKUText) {
      const sku = skuTree.filter(item => item.text === selectedSKUText)[0] || {};
      sku.leaf = [];
      if (sku.id) {
        this.props.onSKUChange(sku, index);
        return;
      }
      this.createSKU(selectedSKUText);
    }
  }
  
  createSKU = (SKUName: string) => {
    this.props.onCreateSKU(SKUName).then(id => {
      const { index } = this.props;
      const sku = {
        id,
        text: SKUName,
        leaf: [],
      };
      this.props.onSKUChange(sku, index);
    });
  }

  handleSKULeafChange = (leaf: Array<BasicItem>) => {
    const { sku, index, onSKUChange } = this.props;
    sku.leaf = leaf;
    onSKUChange(sku, index);
  }

  render() {
    return 'skugroup';
  }
}

export default SKUGroup;
