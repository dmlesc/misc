const zlib = require('zlib');
const gzip = zlib.createGzip();
const fs = require('fs');
const inp = fs.createReadStream('1462313940880');
const out = fs.createWriteStream('1462313940880.gz');

inp.pipe(gzip).pipe(out);