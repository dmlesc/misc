"use strict";

var cred = require('./keys/' + process.argv[2]);
process.env['AZURE_STORAGE_ACCOUNT'] = cred.account;
process.env['AZURE_STORAGE_ACCESS_KEY'] = cred.key;
var StudentId = process.argv[3];

var azure = require('azure-storage');
var blobSvc = azure.createBlobService().withFilter(new azure.ExponentialRetryPolicyFilter());;
var zlib = require('zlib');
var fs = require('fs');

var doc = '';
var stream = blobSvc.createReadStream('testgz', StudentId).pipe(zlib.createGunzip());

stream.on('data', function(chunk) { doc += chunk; });
stream.on('error', function(err) { console.log(err); }); //retry
stream.on('end', function() { updateDoc(doc) });

function updateDoc(doc) {
  try { doc = JSON.parse(doc); }
  catch (e) { console.log(e); } //retry

//  console.log(doc._id);
//  console.log(doc.ActivitySavedDataCollection.length);

  doc.test = "test";

  fs.writeFile(StudentId + '_updated.json', JSON.stringify(doc),  function(err) {
    if (err) { return console.error(err); }
  });

}