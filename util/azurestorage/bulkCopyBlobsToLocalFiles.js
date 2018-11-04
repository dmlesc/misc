var fs = require('fs');

process.env['AZURE_STORAGE_ACCOUNT'] = 'name';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'key';

var azure = require('azure-storage');
var blobSvc = azure.createBlobService();


function getBlobs(container) {
  blobSvc.listBlobsSegmented(container, null, function(error, result, response) {
    if (!error) { /*console.log(response); console.log(result.entries); */
      var blobs = result.entries;
      for (var i=0; i < blobs.length; i++)
        copyBlobToLocal(container, blobs[i].name, container + "/" + blobs[i].name);
    }
    else { console.log(error); }
  });
}

function copyBlobToLocal(dir, blob, path) {
  blobSvc.getBlobToLocalFile(dir, blob, path, function(error, serverBlob) {
    if(!error) { /* Blob available in serverBlob.blob variable */ }
  });
}

getBlobs("fileszipped");