const api = require('coindock-node');

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
      default:
        console.log('unknown event\n', streamEvent);
    }
  }
);

