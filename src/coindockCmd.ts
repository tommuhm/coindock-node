import CoindockWs from './CoindockWS';

const args = process.argv;

if (args.length != 8) {
  console.log(`usage: coindockCmd endpoint exchange symbol interval limit open`);
  console.log(`example: coindockCmd localhost:6666 binance btcusdt 5min 30 true`);
  process.exit(1);
}


const endpoint = args[2];
const exchange = args[3];
const symbol = args[4];
const interval = args[5];
const limit = Number(args[6]);
const open = (args[7] == 'true');

const coindock = new CoindockWs(endpoint);

coindock.onOhlcv(exchange, symbol, interval, limit, open, (msg) => {
  console.log(msg);
});