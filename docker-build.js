var fs = require('fs');
var file = './app/server/ServerService.ts';

fs.writeFileSync(file, fs.readFileSync(file).replace('localhost:9000', '178.62.16.226:9000'));
