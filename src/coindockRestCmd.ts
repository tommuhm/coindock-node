import CoindockRest from './CoindockRest';
import minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

if (argv._length < 4 || argv._length > 6) {
  console.log(`usage: coindockRestCmd endpoint exchange symbol interval [--from=timestampMs] [--to=timestampMs] [--limit=number] [openLimit=number]`);
  console.log(`example: coindockRestCmd localhost:5555 binance btcusdt 5min --from=1547392298000 --limit=500 --openLimit=30`);
  process.exit(1);
}


const endpoint = argv._[0];
const exchange = argv._[1];
const symbol = argv._[2];
const interval = argv._[3];
const limit = argv['limit'] != null ? Number(argv['limit']) : undefined;
const from = argv['from'] != null ? Number(argv['from']) : undefined;
const to = argv['to'] != null ? Number(argv['to']) : undefined;
const openLimit = argv['openLimit'] != null ? Number(argv['openLimit']) : undefined;

const coindock = new CoindockRest({endpoint});

console.log(`using: ${endpoint}, sending: exchange=${exchange}, symbol=${symbol}, interval=${interval}, limit=${limit}, from=${from}, to=${to}, openLimit=${openLimit}`);

coindock.ohlcv({exchange, symbol, interval, limit, from, to, openLimit}, (err, response) => {
  if (err) {
    console.log(err);
  }
  console.log(response);
});