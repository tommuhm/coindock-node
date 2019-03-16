# coindock-node
A wrapper for the Coindock REST and WebSocket APIs.


# Coindock 
Coindock is a cryptocurrency candle-builder service which aims to support all major exchanges with all their currency-pairs and any desired candle interval. The service builds all it's candles directly from the underlying trades and can therefore provide historic and live open-candles for all exchanges and symbols.

Current supported exchanges: `binance`, `coinbase`, `coinbasepro`, `bitfinex,`, `bitstamp`, `kraken`.

Current supported currency-pairs: any currency which is provided by the specified exchange.

Current supported candle-intervals: `Xsec`, `Xmin`, `Xhour`, `Xday`, `Xweek` X can be any positive integer value.


##### Features:
- support for all major cryptocurrency exchanges (coming soon)
- candles for any desired candle interval (live and historic)
- binance like open-candles (live and historic)
- cross exchange, cross symbol trading signals (coming soon)


### [Installation](#Installation) · [Usage](#usage) · [CMD-Tool](#Command-Line-Tool) · [Examples](https://github.com/tommuhm/coindock-node/tree/master/src/examples)


### Installation
```
npm install coindock-node --save
```

### Usage

#### Getting started
```javascript
const api = require('coindock-node');

const coindockRest = new api.CoindockRest({
  endpoint: 'localhost:5555', // required, server address
  timeout: 15000, // optional, defaults to 15000, is the request time out in milliseconds
});

const coindockWs = new api.CoindockWs({
  endpoint: 'localhost:6666', // required, server address,
  debugStreams: false // optional, defaults to false, enables debug information for candles
});
```

#### Load historic candles 

##### with promise
```js
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
```

##### with callback
```js
coindockRest.ohlcv({
  exchange: 'binance',
  symbol: 'BTCUSDT',
  interval: '3h',
  from: 1547392298000,
  limit: 1000,
}, (err, response) => {
  if (err) {
    console.log(err);
  } else {
    console.log(response);
  }
});
```


#### Live candles 

Live candles are provided via a websocket api.

Each call to onXXXX initiates a new websocket for the specified route, and calls your callback with the payload of each message received.  Each call to onXXXX returns the instance of the websocket client if you want direct access (https://www.npmjs.com/package/ws).

##### Single candle stream
```js
coindockWs.onOhlcv({
  exchange: 'binance',
  symbol: 'BTCUSDT',
  interval: '15min',
  limit: 200,
  open: true
}, (data) => {
  console.log(data);
});
```

##### Combined candle stream

With combined streams it is possible to use a single websocket for multiple streams.
 
```js
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
<br>

### Command-Line-Tool

This node module also provides a simple command line tool.

#### Installation
```
npm install coindock-node --g
```

#### Usage 

##### historic data

```bash
coindock-rest coindock-rest endpoint exchange symbol interval [--from=timestampMs] [--to=timestampMs] [--limit=number] [--openLimit=number]
```

##### live data

```bash
coindock-ws endpoint exchange symbol interval [--limit=number] [--open=boolean]
```

#### Examples for binance-btcusdt candles

- load the last 100 1-day candles

```bash
coindock-rest localhost:5555 binance btcusdt 1d --limit=100
```

- load the last 1000 4-hour candles

```bash
coindock-rest localhost:5555 binance btcusdt 4h
```

- load all 30-second candles between 1546300800000 (1/1/2019, 12:00:00 AM) and 1546322400000 (1/1/2019, 06:00:00 AM)

```bash
coindock-rest localhost:5555 binance btcusdt 30sec --from=1546300800000 to=1546322400000
```

- load 300 10-minute candles starting at 1546300800000 (1/1/2019, 12:00:00 AM) and 200 open-candles after the last closed candle

```bash
coindock-rest localhost:5555 binance btcusdt 10min --from=1546300800000 --limit=300 --openLimit=200
```

- live-stream for 10-minute open and closed candles

```bash
coindock-ws localhost:6666 binance btcusdt 10min 
```

- live-stream for 10-second closed candles starting with the next interval-tick

```bash
coindock-ws localhost:6666 binance btcusdt 10sec --open=false
```

- load 300 closed candles and start live-stream for 3-hour open and closed candles

```bash
coindock-ws localhost:6666 binance btcusdt 10sec --limit=300 --open=true
```


# License
[MIT](LICENSE)\
\
\
This wrapper is heavily inspired by binance wrapper https://github.com/zoeyg/binance
