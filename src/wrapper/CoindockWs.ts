import WebSocket from 'ws';
import {JsonOhlcv, WsOhlcvOpts} from '../types';

// const Beautifier = require('./beautifier.js');

export default class CoindockWs {

  // baseUrl not implemented yet!
  private baseUrl: string;
  private combinedUrl: string;
  private debugStreams: boolean;
  private apiKey: string;

  private streams = {
    ohlcv: ({exchange, symbol, interval, limit = 0, open = true}: WsOhlcvOpts) =>
      `${exchange.toLowerCase()}_${symbol.toLowerCase()}_${interval.toLowerCase()}` +
      (limit > 0 ? `_${limit}` : '') +
      (open === true ? '@ohlcv_open' : '@ohlcv')
  };

  private sockets: { [path: string]: WebSocket; } = {};

  public constructor({endpoint, apiKey, debugStreams = false}: { endpoint: string, apiKey: string, debugStreams?: boolean }) {
    this.baseUrl = `ws://${endpoint}/ws/`;
    this.combinedUrl = `ws://${endpoint}/stream?streams=`;
    this.apiKey = apiKey;
    this.debugStreams = debugStreams;
  }

  public onOhlcv(wsOhlcvOpts: WsOhlcvOpts, eventHandler: (msg: any) => void) {
    return this._setupWebSocket(eventHandler, this.streams.ohlcv(wsOhlcvOpts));
  }

  public onCombinedStream(streams: { [type: string]: (...x: any) => string }, eventHandler: (msg: any) => void) {
    return this._setupWebSocket(eventHandler, streams.join('/'), true);
  }

  private _setupWebSocket(eventHandler: (msg: JsonOhlcv | string | { error: boolean, data: Error }) => void,
                          streamUrl: string,
                          isCombined: boolean = false) {
    if (this.sockets[streamUrl]) {
      return this.sockets[streamUrl];
    }
    streamUrl = (isCombined == true ? this.combinedUrl : this.baseUrl) + streamUrl;
    streamUrl += (isCombined == true ? `&` : `?`) + `apiKey=${this.apiKey}`;

    if (this.debugStreams == true) {
      streamUrl += '&debug=true';
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
