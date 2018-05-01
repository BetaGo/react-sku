export type BasicItem = {
  id?: number,
  text?: string,
};

export type SKUItem = {
  id?: number,
  text?: string,
  leaf?: Array<BasicItem>,
};

export type SKUValue = Array<SKUItem>;
export type SKUTree = Array<BasicItem>;
