import _ from 'lodash';
import request from 'request';
import qs from 'querystring';
import assert from 'assert';
import {RestOhlcvOpts} from '../types';
import Beautifier from '../util/Beautifier';

export default class CoindockRest {

  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly apiKey: string;
  private readonly beautifier: Beautifier | undefined;

  public constructor({endpoint, apiKey, timeout = 15000, beautify = true}:
                       { endpoint: string,
                         apiKey: string,
                         timeout?: number,
                         beautify?: boolean
                       }) {
    this.timeout = timeout;
    this.apiKey = apiKey;
    this.baseUrl = `http://${endpoint}/api/v1/data/`;
    if (beautify) {
      this.beautifier = new Beautifier();
    }
  }

  private makeRequest(query: any, route: string, callback?: (err: any, response: any) => void) {
    assert(_.isUndefined(callback) || _.isFunction(callback), 'callback must be a function or undefined');
    assert(_.isObject(query), 'query must be an object');
    Object.keys(query).forEach(key => query[key] === undefined && delete query[key]);

    let queryString;
    const options = {
      url: `${this.baseUrl}${route}?apiKey=${this.apiKey}`,
      timeout: this.timeout
    };

    queryString = qs.stringify(query);
    if (queryString != null) {
      options.url += '&' + queryString;
    }

    const action = (cb: (err: any, payload: any) => void) => {
      request(options, (err, response, body) => {
        let payload;
        try {
          payload = JSON.parse(body);
          if (this.beautifier != null) {
            payload = this.beautifier.beautifyList(payload, `rest_${route}`);
          }
        } catch (e) {
          payload = body;
        }
        if (err) {
          cb(err, payload);
        } else if (response.statusCode < 200 || response.statusCode > 299) {
          cb(new Error(`Response code ${response.statusCode}`), payload);
        } else {
          cb(err, payload);
        }
      });
    };
    if (callback) {
      action(callback);
    } else {
      return new Promise((resolve, reject) => action((err, payload) => {
        if (err) {
          if (payload === undefined) {
            reject(err);
          } else {
            reject(payload);
          }
        } else {
          resolve(payload);
        }
      }));
    }
  }

  ohlcv(restOhlcvOpts: RestOhlcvOpts, callback?: (err: any, response: any) => void) {
    return this.makeRequest(restOhlcvOpts, 'ohlcv', callback);
  }

}
