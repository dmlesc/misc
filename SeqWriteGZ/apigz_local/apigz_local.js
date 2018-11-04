'use strict';

process.env['AZURE_STORAGE_ACCOUNT'] = 'storage_account';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'access_key';

var http = require('http');
var azure = require('azure-storage');
var blobSvc = azure.createBlobService().withFilter(new azure.ExponentialRetryPolicyFilter());;
var zlib = require('zlib');
var fs = require('fs');

var validEndpoints = ['/startActivity', '/completeActivity'];
var container = 'testgz';
var tmp = './tmp/';

if (!fs.accessSync(tmp)) {
    fs.mkdirSync(tmp);
}

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
        var tmpPath = tmp + id;
        stats.id = id;

        stats.init = process.hrtime(time_init); //stats
        var time_getBlob = process.hrtime(); //stats
        blobSvc.getBlobToStream(container, id, fs.createWriteStream(tmpPath), (err, result, blobSvcRes) => {
          stats.getBlob = process.hrtime(time_getBlob); //stats
          if (err) { console.log(err); } //retry
          else {
            var time_gunzip = process.hrtime(); //stats
            fs.readFile(tmpPath, (err, data) => {
              if (err) { console.log(err); } //retry
              else {
                zlib.gunzip(data, (err, gunzipped) => {
                  if (err) { console.log(err); } //retry
                  else {
                    stats.gunzip = process.hrtime(time_gunzip); //stats
                    var time_parse = process.hrtime(); //stats
                    var doc;
                    try {
                      doc = JSON.parse(gunzipped);
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
                      saveDoc(res, doc, id, tmpPath, stats);
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});

function saveDoc(res, doc, id, tmpPath, stats) {
  var time_stringify = process.hrtime(); //stats
  var doc_str = JSON.stringify(doc); 
  stats.stringify = process.hrtime(time_stringify); //stats
  var time_gzip = process.hrtime(); //stats
  zlib.gzip(doc_str, (err, gzipped) => {
    if (err) { console.log(err); } //retry
    else {
      stats.gzip = process.hrtime(time_gzip); //stats
      var time_createBlob = process.hrtime(); //stats
      fs.writeFile(tmpPath, gzipped, (err) => {
        if (err) { console.log(err); } //retry
        else {
          blobSvc.createBlockBlobFromLocalFile(container, id, tmpPath, (err, result, blobSvcRes) => {
            stats.createBlob = process.hrtime(time_createBlob); //stats
            var time_deleteLocalBlob = process.hrtime(); //stats
            fs.unlink(tmpPath, (err) => {
              stats.deleteLocalBlob = process.hrtime(time_deleteLocalBlob); //stats
              if (err) { console.log(err); } //retry
              else {
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
              }
            });
          }); 
        }
      });
    }
  });
}

function sendResponse(res, code, stats, time_end) {
  var stats_str = JSON.stringify(stats); 
  stats.end = process.hrtime(time_end); //stats
  res.writeHead(code, {"Content-Type":"application/json"});
  res.end(stats_str);
}

server.listen(80, '10.0.0.4');
console.log('webserver started');