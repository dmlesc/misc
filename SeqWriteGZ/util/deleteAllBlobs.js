'use strict';

process.env['AZURE_STORAGE_ACCOUNT'] = 'storage_account';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'access_key';

var azure = require('azure-storage');
var blobService = azure.createBlobService().withFilter(new azure.ExponentialRetryPolicyFilter());

var container = 'student';
var pageSize = 100;

var pageOptions = {
  maxResults: pageSize,
  include: 'metadata',
  locationMode: azure.StorageUtilities.LocationMode.PRIMARY_THEN_SECONDARY
};

var blobs = [];

function listBlobs (options, token) {
  blobService.listBlobsSegmented(container, token, options, function(error, result) {
    blobs.push.apply(blobs, result.entries);
    var token = result.continuationToken;
    if(token) {
      console.log(' Received a page of ' + result.entries.length + ' results.');
      listBlobs(options, token);
    }
    else {
      console.log(' Total blobs: ' + blobs.length);
      deleteBlobs();
    }
  });
}

function deleteBlobs() {
  for (var i=0; i < blobs.length; i++) {
    var name = blobs[i].name;
    blobService.deleteBlob(container, name, (error, response) => {
      if(!error){
        // Blob has been deleted
        console.log(' deleted: ' + name);

      }
    });
  }
}

listBlobs(pageOptions, null);