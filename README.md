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
  apiKey: '<YOUR-API-KEY>', // required, api key
  timeout: 15000, // optional, defaults to 15000, is the request time out in milliseconds
});

const coindockWs = new api.CoindockWs({
  endpoint: 'localhost:6666', // required, server address,
  apiKey: '<YOUR-API-KEY>', // required, api key
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
    from: 1546300800000,
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
  from: 1546300800000,
  limit: 1000,
}, (err, response) => {
  if (err) {
    console.log(err);
  } else {
    console.log(response);
  }
});
```

<details>
 <summary>View example response</summary>

```js
[ { time: '2019-01-01T00:00:00.000Z',
    open: 3701.23,
    high: 3713,
    low: 3684.22,
    close: 3689.69,
    volume: 4805769.04920241,
    amount: 1299.906535,
    nrtrades: '10090',
    firstid: '82541550',
    lastid: '82551639',
    openTime: 1546300800000,
    closeTime: 1546308000000,
    intervalMs: 7200000,
    isClosed: true },
  { time: '2019-01-01T02:00:00.000Z',
    open: 3689.67,
    high: 3699.77,
    low: 3675.04,
    close: 3693.13,
    volume: 6244466.01946716,
    amount: 1692.016999,
    nrtrades: '11550',
    firstid: '82551640',
    lastid: '82563189',
    openTime: 1546308000000,
    closeTime: 1546315200000,
    intervalMs: 7200000,
    isClosed: true },
  { time: '2019-01-01T04:00:00.000Z',
    open: 3692.32,
    high: 3720,
    low: 3685.94,
    close: 3699.94,
    volume: 6990641.25149277,
    amount: 1889.855137,
    nrtrades: '11202',
    firstid: '82563190',
    lastid: '82574391',
    openTime: 1546315200000,
    closeTime: 1546322400000,
    intervalMs: 7200000,
    isClosed: true },
  { time: '2019-01-01T06:00:00.000Z',
    open: 3699.95,
    high: 3986.5,
    low: 3699.94,
    close: 3699.95,
    volume: 423.1188821,
    amount: 0.114358,
    nrtrades: '1',
    firstid: '82574392',
    lastid: '82574392',
    openTime: 1546322400000,
    closeTime: 1546322402000,
    intervalMs: 7200000,
    isClosed: false } ]
```
</details>


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
coindock-rest endpoint apiKey exchange symbol interval [--from=timestampMs] [--to=timestampMs] [--limit=number] [--openLimit=number]
```

##### live data

```bash
coindock-ws endpoint apiKey exchange symbol interval [--limit=number] [--open=boolean]
```

#### Examples for binance-btcusdt candles

- load the last 100 1-day candles

```bash
coindock-rest localhost:5555 <YOUR-API-KEY> binance btcusdt 1d --limit=100
```

- load the last 1000 4-hour candles

```bash
coindock-rest localhost:5555 <YOUR-API-KEY> binance btcusdt 4h
```

- load all 30-second candles between 1546300800000 (1/1/2019, 12:00:00 AM) and 1546322400000 (1/1/2019, 06:00:00 AM)

```bash
coindock-rest localhost:5555 <YOUR-API-KEY> binance btcusdt 30sec --from=1546300800000 --to=1546322400000
```

- load 300 10-minute candles starting at 1546300800000 (1/1/2019, 12:00:00 AM) and 200 open-candles after the last closed candle

```bash
coindock-rest localhost:5555 <YOUR-API-KEY> binance btcusdt 10min --from=1546300800000 --limit=300 --openLimit=200
```

- live-stream for 10-minute open and closed candles

```bash
coindock-ws localhost:6666 <YOUR-API-KEY> binance btcusdt 10min 
```

- live-stream for 10-second closed candles starting with the next interval-tick

```bash
coindock-ws localhost:6666 <YOUR-API-KEY> binance btcusdt 10sec --open=false
```

- load 300 closed candles and start live-stream for 3-hour open and closed candles

```bash
coindock-ws localhost:6666 <YOUR-API-KEY> binance btcusdt 10sec --limit=300 --open=true
```


# License
[MIT](LICENSE)\
\
\
This wrapper is heavily inspired by the binance wrapper https://github.com/zoeyg/binance
