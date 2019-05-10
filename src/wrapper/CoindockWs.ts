import WebSocket from 'ws';
import {JsonOhlcv, WsOhlcvOpts} from '../types';
import Beautifier from '../util/Beautifier';

export default class CoindockWs {

  private readonly baseUrl: string;
  private readonly combinedUrl: string;
  private readonly debugStreams: boolean;
  private readonly apiKey: string;
  private readonly beautifier: Beautifier | undefined;

  private streams = {
    ohlcv: ({exchange, symbol, interval, limit = 0, open = true}: WsOhlcvOpts) =>
      `${exchange.toLowerCase()}_${symbol.toLowerCase()}_${interval.toLowerCase()}` +
      (limit > 0 ? `_${limit}` : '') +
      (open ? '@ohlcv_open' : '@ohlcv')
  };

  private sockets: { [path: string]: WebSocket; } = {};

  public constructor({endpoint, apiKey, debugStreams = false, beautify = true}:
                       { endpoint: string,
                         apiKey: string,
                         debugStreams?: boolean,
                         beautify?: boolean;
                       }) {
    this.baseUrl = `ws://${endpoint}/ws/`;
    this.combinedUrl = `ws://${endpoint}/stream?streams=`;
    this.apiKey = apiKey;
    this.debugStreams = debugStreams;
    if (beautify) {
      this.beautifier = new Beautifier();
    }
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
    streamUrl = (isCombined ? this.combinedUrl : this.baseUrl) + streamUrl;
    streamUrl += (isCombined ? `&` : `?`) + `apiKey=${this.apiKey}`;

    if (this.debugStreams) {
      streamUrl += '&debug=true';
    }

    const ws = new WebSocket(streamUrl);

    ws.on('message', (message: string) => {
      let event;
      try {
        event = JSON.parse(message);
        // if (this.beautifier != null) {
        //   if (event.stream) {
        //     payload = this.beautifier.beautifySingle(event, `ws_${route}`);
        //   }
        // }
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
