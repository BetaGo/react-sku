export type BasicItem = {
  id: string | number,
  text: string,
};

export type SKUItem = {
  id: string | number,
  text: string,
  leaf?: Array<BasicItem>,
};

export type SKUValue = Array<SKUItem>;
export type SKUTree = Array<BasicItem>;
