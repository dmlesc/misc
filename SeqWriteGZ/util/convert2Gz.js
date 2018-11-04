'use strict';

const zlib = require('zlib');
const gzip = zlib.createGzip();
const fs = require('fs');

var docPath = './studentdocs/10_S/';
var docGzPath = './studentdocs/10Gz_S/';

var files;

fs.readdir(docPath, (err, list) => {
    if (err) { console.log(err); }
    else {
      files = list;
      compressFile(files.shift());
    }
});

function compressFile(filename) {
  fs.readFile(docPath + filename, (err, data) => {
    if (err) throw err;
    zlib.gzip(data, function (err, result) {
      if (!err) {
        fs.writeFile(docGzPath + filename, result, (err) => {
          if (err) throw err;
          console.log('compressed: ' + filename);
          if (files.length)
            compressFile(files.shift());
        });
      }
    });
  });
}
