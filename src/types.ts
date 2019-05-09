export type WsOhlcvOpts = {
  exchange: string, symbol: string, interval: string, limit?: number, open?: boolean
};

export type RestOhlcvOpts = {
  exchange: string, symbol: string, interval: string, from?: number, to?: number, limit?: number, open?: boolean, openLimit?: number
};

export interface JsonOhlcv {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  amount: number;
  nrtrades: string;

  firstid?: string;
  lastid?: string;

  openTime: number;
  closeTime: number;
  isClosed: boolean;
  intervalMs: number;
}