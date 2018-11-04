'use strict';

process.env['AZURE_STORAGE_ACCOUNT'] = 'storage_account';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'access_key';

var fs = require('fs');

var azure = require('azure-storage');
var blobService = azure.createBlobService().withFilter(new azure.ExponentialRetryPolicyFilter());

var container = 'test';
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
      saveToFile();
    }
  });
}

function saveToFile() {
  var names = [];
  var blobList = 'blobList';

  for (var i=0; i < blobs.length; i++)
    names.push(blobs[i].name);
  fs.writeFile(blobList, JSON.stringify(names), (err) => {
    if (err) throw err;
    console.log('Saved blob names to filename: ' + blobList);
  });
}

listBlobs(pageOptions, null);