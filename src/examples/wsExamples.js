const api = require('coindock-node');

const coindockWs = new api.CoindockWs({
  endpoint: 'localhost:6666', // required, server address,
  debugStreams: false // optional, defaults to false, enables debug information for candles
});

coindockWs.onOhlcv({
  exchange: 'binance',
  symbol: 'BTCUSDT',
  interval: '15min',
  limit: 200,
  open: true
}, (data) => {
  console.log(data);
});

