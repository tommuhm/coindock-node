export type WsOhlcvOpts = {
  exchange: string, symbol: string, interval: string, limit?: number, open?: boolean
};

export type RestOhlcvOpts = {
  exchange: string, symbol: string, interval: string, from?: number, to?: number, limit?: number, openLimit?: number
};