'use strict';

process.env['AZURE_STORAGE_ACCOUNT'] = 'storage_account';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'access_key';

var azure = require('azure-storage');
var blobService = azure.createBlobService().withFilter(new azure.ExponentialRetryPolicyFilter());;
var fs = require('fs');

var container = 'student';
var docPath = './studentdocs/100Gz/';
var uploadedPath = './studentdocs/uploaded/';

var files;

fs.readdir(docPath, function(err, list) {
    if (err)
      console.log(err);
    else {
      files = list;
      uploadFile(files.shift());
    }
});

function uploadFile(filename) {
  var filePath = docPath + filename;
  blobService.createBlockBlobFromLocalFile(container, filename, filePath, function (error) {
    if (error)
      console.log(error);
    else {
      console.log('uploaded ' + filename);

      fs.rename(filePath, uploadedPath + filename, function (err) {
        if (err)
          console.log(err);
        console.log('   moved ' + filename);
      });

      if (files.length)
        uploadFile(files.shift());
    }
  });
}