var fs = require('fs');

process.env['AZURE_STORAGE_ACCOUNT'] = 'name';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'key';

var azure = require('azure-storage');
var blobSvc = azure.createBlobService();

function getFiles(path) {
  fs.readdir(path, function (err, list) {
    if (err) { console.error(err); }
    else { /*console.log(list);*/
      bulkLogToAzure(path, list);
    }
  });
}

function bulkLogToAzure(container, list) {
  for (var i=0; i < list.length; i++)
    logToAzure(container, list[i], container + "/" + list[i]);
}

function logToAzure(container, name, path) {
  blobSvc.createBlockBlobFromLocalFile(container, name, path, function(error, result, response) {
    if (!error) { /*console.log(result);*/ /*console.log(response);*/ }
    else { console.log(error); }
  });
}

getFiles("fileszipped");