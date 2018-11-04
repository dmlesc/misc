// usage:  js getStudentDoc.js [storage account] [StudentId]

"use strict";

var cred = require('./keys/' + process.argv[2]);
process.env['AZURE_STORAGE_ACCOUNT'] = cred.account;
process.env['AZURE_STORAGE_ACCESS_KEY'] = cred.key;
var StudentId = process.argv[3];

var azure = require('azure-storage');
var blobSvc = azure.createBlobService();
var zlib = require('zlib');
var fs = require('fs');

//blobSvc.createReadStream('student', StudentId).pipe(zlib.createGzip()).pipe(fs.createWriteStream(StudentId + '.gz'));
blobSvc.createReadStream('student', StudentId).pipe(fs.createWriteStream('student/' + StudentId));
