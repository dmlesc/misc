'use strict';

process.env['AZURE_STORAGE_ACCOUNT'] = 'account';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'key';

var azure = require('azure-storage');
var blobSvc = azure.createBlobService().withFilter(new azure.ExponentialRetryPolicyFilter());;
var zlib = require('zlib');
var fs = require('fs');

var container = 'testgz';
var blobName = '00d7432c-d83e-489c-bdb9-4aec64c23f83';

function openBlob() {
  blobSvc.getBlobToText(container, blobName, function (err, blobContent, blob) {
    console.log('getBlobToText');
    if (err) {
      console.log('err');
      console.error(err);
    } //retry
    else {
      zlib.createGunzip(blobContent, function (err, inflated) {
        if (err) { console.error(err); } //retry
        else {
          var doc = JSON.parse(inflated);
          console.log(doc._id);
        }
      });
    }
  });
}


function openBlob2() {
  var doc = '';
  var stream = blobSvc.createReadStream(container, blobName).pipe(zlib.createGunzip());
  stream.on('error', function (err) { console.log(err); }); //retry
  stream.on('data', function (chunk) { doc += chunk; });
  stream.on('end', function () {
    //console.log(doc);
    doc = JSON.parse(doc);
    console.log(doc._id);
  });
}

      let body = '';

function openBlob3() {
  //const stream = require('stream');
  

    var stream = require('stream');


    var echoStream = new stream.Writable();
    //echoStream.setEncoding('utf8');
    echoStream._write = function (chunk, encoding, done) {
      //console.log(chunk.toString());
       body += chunk;
      
      done();
    };



  blobSvc.getBlobToStream(container, blobName, echoStream, function(error, result, response){
    if(!error){
      // blob retrieved


      dude();
      


    }
  });
}


function dude() {
console.log('dude');
        try {
          const data = JSON.parse(body);
        } catch (er) {
          // uh oh!  bad json!
          console.log(er);
        }
        console.log(data._id);

}

/*
//  blobSvc.getBlobToStream('mycontainer', 'myblob', fs.createWriteStream('output.txt'), function(error, result, response){

      let body = '';
      echoStream.on('data', (chunk) => {
        body += chunk;
      });
      echoStream.on('end', () => {
        try {
          const data = JSON.parse(body);
        } catch (er) {
          // uh oh!  bad json!
          console.log(er);
        }
        console.log(data._id);
      });

*/

function openBlob4() {
  blobSvc.getBlobToStream(container, blobName, fs.createWriteStream(blobName), function (error, result, response) {
    if (!error) {
      // blob retrieved
    }
  });
}

function openBlob5() {
  var fs = require('fs');
  var Stream = require('stream');

  var ws = new Stream;
  ws.writable = true;
  ws.bytes = 0;
  ws.data = '';

  ws.write = function (buf) {
    ws.bytes += buf.length;
    ws.data += buf.toString();
  }

  ws.end = function (buf) {
    if (arguments.length)
      ws.write(buf);
    ws.writable = false;

    console.log('bytes length: ' + ws.bytes);
    var doc = JSON.parse(ws.data);
    console.log(doc._id);
  }

  //fs.createReadStream('file path').pipe(ws);


  blobSvc.getBlobToStream(container, blobName, ws, function (error, result, response) {
    if (!error) {
      // blob retrieved
    }
  });

}


openBlob2();

