var fs = require('fs');
var file = './app/server/ServerService.ts';

fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace('"localhost:9000"', '"130.225.20.6:9000"'));
