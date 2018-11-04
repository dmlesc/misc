'use strict';

process.env['AZURE_STORAGE_ACCOUNT'] = 'storage_account';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'access_key';

var http = require('http');
var azure = require('azure-storage');
var blobSvc = azure.createBlobService().withFilter(new azure.ExponentialRetryPolicyFilter());;

var validEndpoints = ['/startActivity', '/completeActivity'];
var container = 'test';

var server = http.createServer((request, response) => {
  var time_init = process.hrtime(); //stats
  var stats = {};
  var url = request.url;

console.log(url);
  
  if (validEndpoints.indexOf(url) == -1) {
    console.log('not found');
    sendResponse(response, 404, {error:'not found'});
  }
  else {
    var body = '';
    var code;
    var data;

    request.on('error', (err) => { console.error(err); });
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => {
      try {
        body = JSON.parse(body);
      }
      catch (e) { // console.log(e);
        console.log('error parsing request');
        body = { error: 'parsing request' };
        code = 400;
        data = body;
      }

      if (body.error) { sendResponse(response, code, data, stats); } //retry
      else {
        var id = body.StudentId; //validate
        var doc;
        stats.id = id;
  
        stats.init = process.hrtime(time_init); //stats
        var time_getBlob = process.hrtime(); //stats
        blobSvc.getBlobToText(container, id, (err, blobContent, blob) => {
          stats.getBlob = process.hrtime(time_getBlob); //stats
          if (err) { console.error(err); } //retry
          else {
            var time_parse = process.hrtime(); //stats
            try {
              doc = JSON.parse(blobContent);
            }
            catch (e) { // console.log(e);
              console.log('error parsing doc');
              doc = { error: 'parsing doc' };
              code = 400;
              data = doc;
            }
            stats.parse = process.hrtime(time_parse); //stats
            if (doc.error) { sendResponse(response, code, stats); } //retry
            else {
              var time_editDoc = process.hrtime(); //stats
              switch (url) {
                case "/startActivity":
                  doc.ActivityStartedCollection.push(body.ActivityStartedCollection[0]);
                  doc.StudentLessonStateCollection.push(body.StudentLessonStateCollection[0]);
                  break;
                case "/completeActivity":
                  var lastItem = doc.StudentLessonStateCollection.length - 1;
                  doc.StudentLessonStateCollection[lastItem].LessonState = 'Satisfied';
                  doc.ActivityCountedCollection.push(body.ActivityCountedCollection[0]);
                  break;
              }
              stats.editDoc = process.hrtime(time_editDoc); //stats
              saveDoc(response, doc, stats);
            }
          }
        });
      }
    });
  }
});

function saveDoc(res, doc, stats) {
  var time_stringify = process.hrtime(); //stats
  var text = JSON.stringify(doc);
  stats.stringify = process.hrtime(time_stringify); //stats
  var time_createBlob = process.hrtime(); //stats
  blobSvc.createBlockBlobFromText(container, doc._id, text, (error, result, response) => {
    stats.createBlob = process.hrtime(time_createBlob); //stats
    var time_end = process.hrtime(); //stats
    var code, data;
    if (error) {
      console.log(error);
      code = response.statusCode;
      data = { error: 'saving doc' };
    }
    else { //console.log(result); console.log(response);
      code = 200;
      data = { status: 'success' };
    }
    sendResponse(res, code, stats, time_end);
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