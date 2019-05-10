import _ from 'lodash';

type BeautyObject = { [key: string]: string };

export default class Beautifier {

  private readonly beautifications: { [type: string]: BeautyObject } = {
    rest_ohlcv: {
      0: 'openTime',
      1: 'closeTime',

      2: 'open',
      3: 'high',
      4: 'low',
      5: 'close',

      6: 'volume',
      7: 'amount',
      8: 'nrTrades',

      9: 'isClosed',

      10: 'firstId',
      11: 'lastId',
    },
    ws_ohlcv: {
      t: 'openTime',
      T: 'closeTime',

      o: 'open',
      c: 'close',
      h: 'high',
      l: 'low',

      v: 'volume',
      a: 'amount',
      n: 'trades',

      x: 'isClosed',

      f: 'firstId',
      L: 'lastId',

      e: 'exchange',
      s: 'symbol',
      i: 'interval',


      q: 'quoteVolume',
      V: 'volumeActive',
      Q: 'quoteVolumeActive',
      B: 'ignored'
    },
  };

  beautifyList(array: any, type: string) {

    const beautifyObj = this.beautifications[type];
    if (beautifyObj == null) {
      return array;
    }
    if (!_.isArray(array)) {
      return array;
    }

    const result: { [key: string]: any }[] = [];

    for (const objOrList of array) {
      if (!_.isArray(objOrList) && !_.isObject(objOrList)) {
        return array;
      }
      result.push(this.beautifySingle(objOrList, type));
    }

    return result;
  }

  beautifySingle(single: any, type: string) {

    const beautifyObj = this.beautifications[type];
    if (beautifyObj == null) {
      return single;
    }

    if (!_.isArray(single) && !_.isObject(single)) {
      return single;
    }
    const item: { [key: string]: any } = {};
    _.each(single, (element: any, key) => {
      item[beautifyObj[key]] = element;
    });

    return item;
  }

}