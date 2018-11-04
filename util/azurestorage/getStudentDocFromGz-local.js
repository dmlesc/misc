"use strict";

var zlib = require('zlib');
var fs = require('fs');

var doc = '';
var stream = fs.createReadStream('44c9ff14-892b-48cd-a444-872041cc1116.gz').pipe(zlib.createGunzip());

stream.on('data', function(chunk) {
   doc += chunk;
});

stream.on('error', function(err) {
   console.log(err);
});

stream.on('end', function() {
   doc = JSON.parse(doc);
   console.log(doc._id);
});
