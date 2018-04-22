import * as React from 'react';
import { Select, message } from 'antd';

import { BasicItem, SKUItem } from '../types';

const { Option } = Select;

type SKUContainerProps = {
  skuItem: SKUItem,
  onFetchSKU: (groupId: string | number) => Promise<Array<BasicItem>>,
  onCreateSKU: (SKUName: string) => Promise<BasicItem>,
  onSKULeafChange: (leaf: Array<BasicItem>) => void,
};

type SKUContainerState = {
  id: string | number,
  newSKUIndex?: number,
  newSKUText?: string,
  skuOptions: Array<BasicItem>,
};

class SKUContainer extends React.Component<SKUContainerProps, SKUContainerState> {
  constructor(props: SKUContainerProps) {
    super(props);
    this.state = {
      id: '',
      skuOptions: [],
    };
  }

  componentDidMount() {
    const { skuItem } = this.props;
    if (skuItem.id) {
      this.props.onFetchSKU(skuItem.id);
    }
  }

  componentWillReceiveProps(nextProps: SKUContainerProps) {
    const { id } = nextProps.skuItem;
    if (this.state.id === id) {
      return;
    }
    if (id) {
      this.props.onFetchSKU(id)
        .then(skuArr => {
          this.setState({
            skuOptions: skuArr,
          });
        });
    }
  }

  createSKU = (name: string, index: number) => {
    if (!name) {
      return;
    }

    const { skuItem } = this.props;
    const { leaf = [] } = skuItem;

    const { skuOptions } = this.state;

    this.props.onCreateSKU(name)
      .then(item => {
        this.setState({
          skuOptions: [
            ...skuOptions,
            item,
          ]
        });
        leaf[index] = item;
        this.props.onSKULeafChange(leaf);
      });

  }

  handleSKUChange = (value: string, index: number) => {
    if (value && value.length > 30) {
      // 输入的SKU文字长度最大设置为30
      value = value.slice(0, 30);
    }
    this.setState({
      newSKUIndex: index,
      newSKUText: value,
    });
  }

  handleOnFocus = (index: number) => {
    const { skuItem } = this.props;
    const { leaf = [] } = skuItem;
    const curLeafText = leaf[index].text;
    this.setState({
      newSKUIndex: index,
      newSKUText: curLeafText,
    });
  }
  
  handleOnBlur = (index: number) => {
    const { newSKUText, skuOptions } = this.state;
    const { skuItem } = this.props;
    const { leaf = [] } = skuItem;

    const curSKU = leaf[index];

    if (curSKU.text === newSKUText) {
      return;
    }

    if (!newSKUText) {
      const item = { id: '', text: ''};
      leaf[index] = item;
      this.props.onSKULeafChange(leaf);
      return;
    }

    if (
      leaf.some((item, idx) => item.text === newSKUText && index !== idx)
    ) {
      message.warn('规格值不能重复。');
      this.setState({
        newSKUIndex: undefined,
        newSKUText: undefined,
      });
      return;
    }

    const value = skuOptions.filter(item => item.text === newSKUText)[0] || {};
    if (!value.id && newSKUText) {
      // 新加的sku
      this.createSKU(newSKUText, index);
    }

    if (value.id !== curSKU.id) {
      // 更新 SKU
      leaf[index] = value;
      this.props.onSKULeafChange(leaf);
      return;
    }
  }

  handleAddSKU = () => {
    const { skuItem } = this.props;
    const { leaf = [] } = skuItem;
    leaf.push({
      id: '',
      text: '',
    });
    this.props.onSKULeafChange(leaf);
  }

  handleDelSKU = (idx: number) => {
    this.setState({
      newSKUIndex: undefined,
      newSKUText: undefined,
    });
    const { skuItem } = this.props;
    const { leaf = [] } = skuItem;
    leaf.splice(idx, 1);
    this.props.onSKULeafChange(leaf);
  }

  getOptions = () => {
    const { skuOptions } = this.state;
    const { skuItem } = this.props;
    const { leaf = [] } = skuItem;

    let optionValues = [...skuOptions];
    for (let i = 0; i < leaf.length; i++) {
      // 过滤掉已选择的sku
      optionValues = optionValues.filter(item => item.text !== leaf[i].text);
    }
    return optionValues.map((d => <Option key={d.text} value={d.text}>{d.text}</Option>));
  }

  renderSKUValues = () => {
    const { skuItem } = this.props;
    const { leaf = [] } = skuItem;
    const { newSKUIndex, newSKUText } = this.state;

    return leaf.map((sku, index) => (
      <div key={index}>
        <Select
          mode="combobox"
          value={newSKUIndex === index ? newSKUText : sku.text}
          onChange={(value: string) => this.handleSKUChange(value, index)}
          onBlur={() => this.handleOnBlur(index)}
          onFocus={() => this.handleOnFocus(index)}
        >
          {this.getOptions()}
        </Select>
        <div
          className="_badge"
          onClick={() => this.handleDelSKU(index)}
        >
          X
        </div>
      </div>
    ));
  }

  render() {
    const { skuItem } = this.props;
    if (!skuItem.id) {
      return null;
    }
    return (
      <div>
        {this.renderSKUValues()}
        <a onClick={this.handleAddSKU}>添加规格值</a>
      </div>
    );
  }
}

export default SKUContainer;