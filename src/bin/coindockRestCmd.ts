#!/usr/bin/env node

import CoindockRest from '../wrapper/CoindockRest';
import minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

if (argv._.length < 5 || argv._.length > 7) {
  usage();
}


const endpoint = argv._[0];
const apiKey = argv._[1];
const exchange = argv._[2];
const symbol = argv._[3];
const interval = argv._[4];
const limit = argv['limit'] != null ? Number(argv['limit']) : undefined;
const from = argv['from'] != null ? Number(argv['from']) : undefined;
const to = argv['to'] != null ? Number(argv['to']) : undefined;
const open = argv['open'] != null ? argv['open'] === 'true': false;
const openLimit = argv['openLimit'] != null ? Number(argv['openLimit']) : undefined;

if (endpoint == null || exchange == null || symbol == null || interval == null) {
  usage();
}

const coindock = new CoindockRest({endpoint, apiKey});

console.log(`using: ${endpoint}, sending: exchange=${exchange}, symbol=${symbol}, interval=${interval}, ` +
 `limit=${limit}, from=${from}, to=${to}, open=${open} openLimit=${openLimit}`);

coindock.ohlcv({exchange, symbol, interval, limit, from, to, open, openLimit}, (err, response) => {
  if (err) {
    console.log(err);
  }
  console.log(response);
});

function usage() {
  console.log(`usage: ./coindock-rest endpoint apiKey exchange symbol interval [--from=timestampMs] [--to=timestampMs] [--limit=number] [--open=boolean] [--openLimit=number]`);
  console.log(`example: ./coindock-rest localhost:5555 <YOUR-API-KEY> binance btcusdt 5min --from=1547392298000 --limit=500 --openLimit=30`);
  process.exit(1);
}