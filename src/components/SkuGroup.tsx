import * as React from 'react';
import { Select, message, Button, Row, Col } from 'antd';

import { SKUValue, SKUItem, SKUTree, BasicItem } from '../types';

import SKUContainer from './SKUContainer';

const { Option } = Select;

type SKUGroupProps = {
  index: number,
  skuItem: SKUItem,
  skuTree: SKUTree,
  selectedSKU: Array<SKUItem>,
  onSKUChange: (skuItem: SKUItem, index: number) => void,
  onSKUDelete: () => void;
  onFetchSKU: (groupName: string) => Promise<Array<BasicItem>>,
  onCreateGroup: (groupName: string) => Promise<BasicItem>,
  onCreateSKU: (SKUName: string) => Promise<BasicItem>,
};

type SKUGroupState = {
  selectedSKUText: string,
};

class SKUGroup extends React.Component<SKUGroupProps, SKUGroupState> {
  constructor(props: SKUGroupProps) {
    super(props);
    this.state = {
      selectedSKUText: props.skuItem.text || '',
    };
  }

  componentWillReceiveProps(nextProps: SKUGroupProps) {
    const { skuItem } = nextProps;
    if (skuItem && skuItem.text) {
      this.setState({
        selectedSKUText: skuItem.text,
      });
    }
  }

  handleSelectChange = (value: string) => {
    if (value && value.length > 30) {
      value = value.slice(0, 30);
    }
    this.setState({
      selectedSKUText: value,
    });
  }

  handleOnBlur = () => {
    const { skuTree, index, skuItem } = this.props;
    const { selectedSKUText }  = this.state;

    if (!selectedSKUText) {
      const emptySKU: SKUItem = {
        id: '',
        text: '',
        leaf: [],
      };
      this.props.onSKUChange(emptySKU, index);
      return;
    }

    const selectedSKU = skuTree.filter(item => item.text === selectedSKUText)[0] || {};
    const sku: SKUItem = {...selectedSKU};

    if (!sku.id && selectedSKUText) {
      this.createSKU(selectedSKUText);
    }
    if (sku.id !== skuItem.id) {
      sku.leaf = [];
      this.props.onSKUChange(sku, index);
      return;
    }
  }
  
  createSKU = (SKUName: string) => {
    this.props.onCreateSKU(SKUName).then(item => {
      const { index } = this.props;
      this.props.onSKUChange(item, index);
    });
  }

  handleSKULeafChange = (leaf: Array<BasicItem>) => {
    const { skuItem, index, onSKUChange } = this.props;
    skuItem.leaf = leaf;
    onSKUChange(skuItem, index);
  }

  renderOptions = () => {
    const { selectedSKU, skuTree } = this.props;
    const selectedIdArr = selectedSKU.map(item => item.id);
    const canSelectedArr = skuTree.filter(item => selectedIdArr.indexOf(item.id) === -1);
    const options = canSelectedArr.map(d => <Option key={d.text} value={d.text}>{d.text}</Option>);
    return options;
  }

  render() {
    const { skuItem } = this.props;
    const { selectedSKUText } = this.state;
    return (
      <div>
        <Row>
          <Col span={2}>规格名</Col>
          <Col span={22}>
            <Select
              mode="combobox"
              onChange={this.handleSelectChange}
              onBlur={this.handleOnBlur}
              value={selectedSKUText}
            >
              {this.renderOptions()}
            </Select>
            <a onClick={this.props.onSKUDelete}>删除</a>
          </Col>
        </Row>
        <Row>
          <Col span={2}>规格值</Col>
          <Col span={22}>
            <SKUContainer
              skuItem={skuItem}
              onSKULeafChange={this.handleSKULeafChange}
              onCreateSKU={this.props.onCreateSKU}
              onFetchSKU={this.props.onFetchSKU}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default SKUGroup;
