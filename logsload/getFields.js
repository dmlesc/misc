'use strict';

const fs = require('fs');
const zlib = require('zlib');

var docPath = 'C:/logs/logs_client/';
var docPath = 'C:/logs/test/';
var files;
var fields = [];
var fileCount = 0;
var logCount = 0;

fs.readdir(docPath, (err, list) => {
  if (err) { console.log(err); }
  else {
    files = list;
    setInterval(getFields, 500);
  }
});

function getFields() {
  var filename = files.shift();

  if (filename) {
    fs.readFile(docPath + filename, (err, data) => {
      if (err) throw err;
      zlib.gunzip(data, (err, result) => {
        if (!err) {
          fileCount++;
          var logs = JSON.parse(result);

          for (var i=0; i<logs.length; i++) {
            logCount++;
            var log = logs[i];
            Object.keys(log).forEach( (field) => {
              if (fields.indexOf(field) == -1) {
                console.log(field);
                fields.push(field);
              }

              if (field == 'Exception')
                console.log(field, log[field]);

            });
            process.stdout.write(fileCount + ' - ' + logCount + '\r');
          }
        }
      });
    });
  }
  else {
    console.log('done')
    console.log(fields);
  }
}



process.on('uncaughtException', (err) => {
  console.log(err);
});