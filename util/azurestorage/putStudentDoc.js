"use strict";

var cred = require('./keys/' + process.argv[2]);
process.env['AZURE_STORAGE_ACCOUNT'] = cred.account;
process.env['AZURE_STORAGE_ACCESS_KEY'] = cred.key;
var StudentId = process.argv[3];

var azure = require('azure-storage');
var blobSvc = azure.createBlobService();
var fs = require('fs');

//blobSvc.createReadStream('student', StudentId).pipe(zlib.createGzip()).pipe(fs.createWriteStream(StudentId + '.gz'));

blobSvc.createBlockBlobFromLocalFile('student', StudentId, StudentId + '.gz', function(error, result, response){
  if(!error){
    // file uploaded
  }
});


/*
var blobService = azure.createBlobService();
blobService.createBlockBlobFromStream('container', 'filename', fs.createReadStream(StudentId + '.gz'), 11, function(error){
    if(!error){
        // Blob uploaded
    }
});
*/


