'use strict';

process.env['AZURE_STORAGE_ACCOUNT'] = 'storage_account';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'access_key';

const http = require('http');
const azure = require('azure-storage');
const blobSvc = azure.createBlobService().withFilter(new azure.ExponentialRetryPolicyFilter());;
const zlib = require('zlib');
const fs = require('fs');
const spigot = require("stream-spigot");

var validEndpoints = ['/startActivity', '/completeActivity'];
var container = 'testgz';

var server = http.createServer((req, res) => {
  var time_init = process.hrtime(); //stats
  var stats = {};
  var url = req.url;

console.log(url);
  
  if (validEndpoints.indexOf(url) == -1) {
    console.log('not found');
    sendResponse(res, 404, {error:'not found'});
  }
  else {
    var reqBody = '';
    var code;
    var data;

    req.on('error', (err) => { console.log(err); });
    req.on('data', (chunk) => { reqBody += chunk; });
    req.on('end', () => {
      try {
        reqBody = JSON.parse(reqBody);
      }
      catch (e) { // console.log(e);
        console.log('error parsing request');
        reqBody = { error: 'parsing request' };
        code = 400;
      }
      if (reqBody.error) { sendResponse(response, code, data, stats); } //retry
      else {
        var id = reqBody.StudentId; //validate
        var blob = '';
        stats.id = id;
  
        stats.init = process.hrtime(time_init); //stats
        var time_getBlob = process.hrtime(); //stats
        var read = blobSvc.createReadStream(container, id).pipe(zlib.createGunzip());
        read.on('data', function(chunk) { blob += chunk; });
        read.on('error', function(err) { console.log(err); }); //retry
        read.on('end', function() {
          stats.getBlob = process.hrtime(time_getBlob); //stats
          var time_parse = process.hrtime(); //stats
          var doc;
          try {
            doc = JSON.parse(blob);
          }
          catch (e) { // console.log(e);
            console.log('error parsing doc');
            doc = { error: 'parsing doc' };
            code = 400;
            data = doc;
          }
          stats.parse = process.hrtime(time_parse); //stats
          if (doc.error) { sendResponse(res, code, stats); } //retry
          else {
            var time_editDoc = process.hrtime(); //stats
            switch (url) {
              case '/startActivity':
                doc.ActivityStartedCollection.push(reqBody.ActivityStartedCollection[0]);
                doc.StudentLessonStateCollection.push(reqBody.StudentLessonStateCollection[0]);
                break;
              case '/completeActivity':
                var lastItem = doc.StudentLessonStateCollection.length - 1;
                doc.StudentLessonStateCollection[lastItem].LessonState = 'Satisfied';
                doc.ActivityCountedCollection.push(reqBody.ActivityCountedCollection[0]);
                break;
            }
            stats.editDoc = process.hrtime(time_editDoc); //stats
            saveDoc(res, doc, id, stats);
          }
        });
      }
    });
  }
});

function saveDoc(res, doc, id, stats) {
  var time_stringify = process.hrtime(); //stats
  var doc_str = JSON.stringify(doc); 
  stats.stringify = process.hrtime(time_stringify); //stats

  var time_createBlob = process.hrtime(); //stats
  var write = blobSvc.createWriteStreamToBlockBlob(container, id, (err, result, response) => {
    stats.createBlob = process.hrtime(time_createBlob); //stats
    var time_end = process.hrtime(); //stats
    var code, data;
    if (err) { //retry 
      console.log(err);
      code = blobSvcRes.statusCode;
      data = { error: 'saving doc' };
    }
    else { //console.log(result); console.log(blobSvcRes);
      code = 200;
      data = { status: 'success' };
    }
    sendResponse(res, code, stats, time_end);
  });
  spigot.array([doc_str]).pipe(zlib.createGzip()).pipe(write);
}

function sendResponse(res, code, stats, time_end) {
  var stats_str = JSON.stringify(stats); 
  stats.end = process.hrtime(time_end); //stats
  res.writeHead(code, {"Content-Type":"application/json"});
  res.end(stats_str);
}

server.listen(80, '10.0.0.4');
console.log('webserver started');