"use strict";

const fs = require('fs');
const zlib = require('zlib');

var docGzPath = './';
var filename = '00d7432c-d83e-489c-bdb9-4aec64c23f83';

function makeInflate() {
  fs.readFile(docGzPath + filename, (err, data) => {
    if (err) throw err;
    zlib.gunzip(data, function (err, result) {
      if (!err) {
        console.log('inflated: ' + filename);
        var obj = JSON.parse(result);
        console.log(obj._id);
//        console.log(result.toString());
        //console.log(JSON.stringify(obj));
        
      }
    });
  });
}

makeInflate();



  /*
  var gzip = zlib.createGzip();
  var doc = '';

  gzip.on('error', function (err) { console.log(err); });
  gzip.on('data', function (chunk) { doc += chunk; });
  gzip.on('end', function () {
    fs.writeFile('string2stream', doc, (err) => { 
      if (err) throw err;
      console.log('It\'s saved!');
    });
  });
  gzip.write(JSON.stringify(obj));
  gzip.end();
  */
