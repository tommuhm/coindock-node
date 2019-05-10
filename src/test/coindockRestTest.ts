import {CoindockRest} from '../coindock';

const coindockRest = new CoindockRest({
  endpoint: 'localhost:9999', // required, server address
  apiKey: '<YOUR-API-KEY>', // required, api key
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

