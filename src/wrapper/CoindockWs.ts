import WebSocket from 'ws';

// const Beautifier = require('./beautifier.js');

export default class CoindockWs {

  // baseUrl not implemented yet!
  private baseUrl: string;
  private combinedUrl: string;
  private debugStreams: boolean;

  private streams = {
    ohlcv: (exchange: string,
            symbol: string,
            interval: string,
            limit: number,
            open: boolean) =>
      `${exchange.toLowerCase()}_${symbol.toLowerCase()}_${interval.toLowerCase()}` + (limit > 0 ? `_${limit}` : '') +
      (open === true ? '@ohlcv_open' : '@ohlcv')
  };

  private sockets: { [path: string]: WebSocket; } = {};

  public constructor({endpoint, debugStreams = false}: { endpoint: string, debugStreams?: boolean }) {
    this.baseUrl = `ws://${endpoint}/ws/`;
    this.combinedUrl = `ws://${endpoint}/stream?streams=`;
    this.debugStreams = debugStreams;
  }

  public onOhlcv({exchange, symbol, interval, limit = 0, open = true}:
                   { exchange: string, symbol: string, interval: string, limit?: number, open?: boolean },
                 eventHandler: (msg: any) => void) {
    return this._setupWebSocket(eventHandler, this.streams.ohlcv(exchange, symbol, interval, limit, open));
  }

  public onCombinedStream(streams: { [type: string]: (...x: any) => string }, eventHandler: (msg: any) => void) {
    return this._setupWebSocket(eventHandler, streams.join('/'));
  }

  private _setupWebSocket(eventHandler: (msg: any) => void, streamUrl: string, isCombined: boolean = false) {
    if (this.sockets[streamUrl]) {
      return this.sockets[streamUrl];
    }
    streamUrl = (isCombined == true ? this.combinedUrl : this.baseUrl) + streamUrl;
    if (this.debugStreams == true) {
      streamUrl += isCombined == true ? '&debug=true' : '?debug=true';
    }

    const ws = new WebSocket(streamUrl);

    ws.on('message', (message: string) => {
      let event;
      try {
        event = JSON.parse(message);
      } catch (e) {
        event = message;
      }

      eventHandler(event);
    });

    ws.on('error', (err: Error) => {
      eventHandler({error: true, data: err});
      // node.js EventEmitters will throw and then exit if no error listener is registered
    });

    ws.on('close', (code: number, reason: string) => {
      eventHandler(reason);
    });

    return ws;
  }

}
