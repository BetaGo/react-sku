import * as React from 'react';
import { Select, Row, Col, message } from 'antd';

import { SKUItem, SKUTree, BasicItem } from '../types';

import SKUContainer from './SKUContainer';

const { Option } = Select;

type SKUGroupProps = {
  index: number,
  skuItem: SKUItem,
  skuTree: SKUTree,
  selectedSKU: Array<SKUItem>,
  onSKUChange: (skuItem: SKUItem, index: number) => void,
  onSKUDelete: () => void;
  onFetchSKU: (groupId: number) => Promise<Array<BasicItem>>,
  onCreateGroup: (groupName: string) => Promise<BasicItem>,
  onCreateSKU: (SKUName: string, groupId: number) => Promise<BasicItem>,
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
    const { skuTree, index, skuItem, selectedSKU } = this.props;
    const { selectedSKUText }  = this.state;

    if (!selectedSKUText) {
      const emptySKU: SKUItem = {
        id: undefined, 
        text: '',
        leaf: [],
      };
      this.props.onSKUChange(emptySKU, index);
      return;
    }

    if (
      selectedSKU.some((item, idx) => item.text === selectedSKUText && index !== idx)
    ) {
      message.warn('规格名称不能重复');
      const emptySKU = {
        id: undefined,
        text: '',
        leaf: []
      };
      this.setState({
        selectedSKUText: '',
      });
      this.props.onSKUChange(emptySKU, index);
      return;
    }

    const sku: SKUItem = skuTree.filter(item => item.text === selectedSKUText)[0] || {};

    if (!sku.id && selectedSKUText) {
      this.createSKUName(selectedSKUText);
    }
    if (sku.id !== skuItem.id) {
      sku.leaf = [];
      this.props.onSKUChange(sku, index);
      return;
    }
  }
  
  createSKUName = (skuName: string) => {
    if (!skuName) {
      return;
    }
    this.props.onCreateGroup(skuName).then(item => {
      const { index } = this.props;
      const sku = {
        id: item.id,
        text: item.text,
        leaf: [],
      };
      this.props.onSKUChange(sku, index);
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
              style={{ width: 180, marginRight: 20 }}
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
