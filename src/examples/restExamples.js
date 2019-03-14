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

