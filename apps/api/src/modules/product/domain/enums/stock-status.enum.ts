export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export const STOCK_STATUS_VALUES = Object.values(StockStatus);

export type StockStatusType = (typeof STOCK_STATUS_VALUES)[number];

export const isStockStatus = (value: string): value is StockStatus => {
  return STOCK_STATUS_VALUES.includes(value as StockStatus);
};
