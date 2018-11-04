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
        unzipBlobToFile(container, blobs[i].name, container + "/" + blobs[i].name);
    }
    else { console.log(error); }
  });
}

function unzipBlobToFile(dir, blob, path) {
  blobSvc.getBlobToStream('mycontainer', 'myblob', fs.createWriteStream('output.txt'), function(error, result, response) {
    if(!error){
      // blob retrieved
    }
  });
}

getBlobs("fileszipped");