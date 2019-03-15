# coindock-node
A wrapper for the Coindock REST and WebSocket APIs.


# Coindock 
Coindock is a cryptocurrency candle-builder service which aims to support all exchanges with all their currency-pairs and any desired candle interval. The service builds all it's candles directly from the underlying trades and can therefore provide open-candles for all exchanges and symbols.

Features:
- support for all major cryptocurrency exchanges (coming soon)
- candles for any desired candle interval (live and historic)
- binance like open-candles (live and historic)
- cross exchange, cross symbol trading signals (coming soon)


Current supported exchanges: `binance`, `coinbase`, `coinbasepro`, `bitfinex,`, `bitstamp`, `kraken`.

Current supported currency-pairs: any currency which is provided by the specified exchange.

Current supported candle-intervals: `Xsec`, `Xmin`, `Xhour`, `Xday`, `Xweek` X can be any positive integer value.


# Usage/Example
```js
const api = require('coindock-node');

const coindockRest = new api.CoindockRest({
  endpoint: 'localhost:5555', // required, server address
  timeout: 15000, // optional, defaults to 15000, is the request time out in milliseconds
});

// promise example
coindockRest.ohlcv({
    exchange: 'binance',
    symbol: 'BTCUSDT',
    interval: '5min',
    from: 1547392298000,
    limit: 500,
    openLimit: 200
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });

// callback example
coindockRest.ohlcv({
  exchange: 'binance',
  symbol: 'BTCUSDT',
  interval: '5min',
  from: 1547392298000,
  limit: 500,
  openLimit: 200
}, (err, response) => {
  if (err) {
    console.log(err);
  } else {
    console.log(response);
  }
});


/*
 * WebSocket API
 *
 * Each call to onXXXX initiates a new websocket for the specified route, and calls your callback with
 * the payload of each message received.  Each call to onXXXX returns the instance of the websocket
 * client if you want direct access(https://www.npmjs.com/package/ws).
 */
const coindockWs = new api.CoindockWs({
  endpoint: 'localhost:6666', // required, server address,
  debugStreams: false // optional, defaults to false, enables debug information for candles
});

// single stream example
coindockWs.onOhlcv({
  exchange: 'binance',
  symbol: 'BTCUSDT',
  interval: '15min',
  limit: 200,
  open: true
}, (data) => {
  console.log(data);
});

/*
 * You can use one websocket for multiple streams.
 */
const streams = coindockWs.streams;

const btcusdt15min = streams.ohlcv({exchange: 'binance', symbol: 'btcusdt', interval: '15min', limit: 200, open: false});
const ethusdt3h = streams.ohlcv({exchange: 'binance', symbol: 'ethusdt', interval: '3h', limit: 5});
const ethbtc1d = streams.ohlcv({exchange: 'binance', symbol: 'ethbtc', interval: '1d', limit: 200, open: true});
const bnbbtc10sec = streams.ohlcv({exchange: 'binance', symbol: 'bnbbtc', interval: '1sec'});

coindockWs.onCombinedStream([
    btcusdt15min,
    ethusdt3h,
    ethbtc1d,
    bnbbtc10sec
  ],
  (streamEvent) => {
    switch(streamEvent.stream) {
      case btcusdt15min:
        console.log('OHLCV for btcusdt15min \n', streamEvent.data);
        break;
      case ethusdt3h:
        console.log('OHLCV for ethusdt3h \n', streamEvent.data);
        break;
      case ethbtc1d:
        console.log('OHLCV for ethbtc1d \n', streamEvent.data);
        break;
      case bnbbtc10sec:
        console.log('OHLCV for bnbbtc10sec \n', streamEvent.data);
        break;
    }
  }
);

```


This wrapper is heavily inspired by binance wrapper https://github.com/zoeyg/binance
