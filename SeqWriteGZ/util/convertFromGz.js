"use strict";

const zlib = require('zlib');
const gunzip = zlib.createGunzip();
const fs = require('fs');

var file = '00a13009-0abf-4ab5-9d2e-210f781b8fc2';

function uncompress(filename) {
  const inp = fs.createReadStream(filename);
  const out = fs.createWriteStream(filename + '_gunzip');
  inp.pipe(gunzip).pipe(out);
}

uncompress(file);
