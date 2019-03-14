#!/usr/bin/env node

import CoindockWs from '../wrapper/CoindockWs';
import minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

if (argv._.length < 4 || argv._.length > 6) {
  usage();
}

const endpoint = argv._[0];
const exchange = argv._[1];
const symbol = argv._[2];
const interval = argv._[3];
const limit = argv['limit'] != null ? Number(argv['limit']) : undefined;
const open = argv['open'] != null ? (argv['open'] == 'true') : undefined;

if (endpoint == null || exchange == null || symbol == null || interval == null) {
  usage();
}

const coindock = new CoindockWs(endpoint);

console.log(`using: ${endpoint}, sending: exchange=${exchange}, symbol=${symbol}, interval=${interval}, limit=${limit}, open=${open}`);

coindock.onOhlcv(exchange, symbol, interval, limit, open, (msg) => {
  console.log(msg);
});

function usage() {
  console.log(`usage: ./coindock-ws endpoint exchange symbol interval  [limit=number] [open=boolean]`);
  console.log(`example: ./coindock-ws localhost:6666 binance btcusdt 5min --limit=30 --open=true`);
  process.exit(1);
}