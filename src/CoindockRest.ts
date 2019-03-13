import _ from 'lodash';
import request from 'request';
import qs from 'querystring';
import assert from 'assert';

export default class CoindockRest {

  private baseUrl: string;
  private timeout: number;

  public constructor({endpoint, timeout = 15000}: {timeout?: number, endpoint: string}) {
    console.log(timeout);
    this.timeout = timeout;
    this.baseUrl = `http://${endpoint}/api/v1/data/`;
  }

  private makeRequest(query: any, callback: (err: any, response: any) => void, route: string) {
    assert(_.isUndefined(callback) || _.isFunction(callback), 'callback must be a function or undefined');
    assert(_.isObject(query), 'query must be an object');
    Object.keys(query).forEach(key => query[key] === undefined && delete query[key]);

    let queryString;
    const options = {
      url: `${this.baseUrl}${route}`,
      timeout: this.timeout
    };

    queryString = qs.stringify(query);
    if (queryString != null) {
      console.log(queryString);;
      options.url += '?' + queryString;
    }

    const action = (cb: (err: any, payload: any) => void) => {
      request(options, (err, response, body) => {
        let payload;
        try {
          payload = JSON.parse(body);
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

  ohlcv(query: { exchange: string, symbol: string, interval: string, from?: number, to?: number, limit?: number, openLimit?: number },
        callback: (err: any, response: any) => void) {
    return this.makeRequest(query, callback, '/ohlcv');
  }

}
