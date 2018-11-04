process.env['AZURE_STORAGE_ACCOUNT'] = 'name';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'key';

var azure = require('azure-storage');
var blobSvc = azure.createBlobService();

function getBlobs(container) {
  blobSvc.listBlobsSegmented(container, null, function(error, result, response) {
    if (!error){ /*console.log(response); console.log(result.entries); */
      bulkDeleteBlobsFromAzure(container, result.entries);
    }
    else { console.log(error); }
  });
}

function bulkDeleteBlobsFromAzure(container, blobs) {
  for (var i=0; i < blobs.length; i++) {
    var name = blobs[i].name;
    deleteAzureBlob(container, name);
  }
}

function deleteAzureBlob(container, name) {
  blobSvc.deleteBlob(container, name, function(error, response) {
    if(!error){ /* Blob has been deleted */  }
    else { console.error(error); }
  });
}

getBlobs("fileszipped");
//getBlobs("testmongo1");