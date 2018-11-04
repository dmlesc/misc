'use strict';

process.env['AZURE_STORAGE_ACCOUNT'] = 'storage_account';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'access_key';

var fs = require('fs');
var azure = require('azure-storage');
var blobService = azure.createBlobService().withFilter(new azure.ExponentialRetryPolicyFilter());

var container = 'student';
var savePath = './save/Path/';
var totalBlobs = 0;
var pageSize = 50;
var unsavedBlobs = [];

var pageOptions = {
  maxResults: pageSize,
  include: 'metadata',
  locationMode: azure.StorageUtilities.LocationMode.PRIMARY_THEN_SECONDARY
};

function getAllBlobs(options, token, callback) {
  console.log('Getting a page.');

  blobService.listBlobsSegmented(container, token, options, function(error, result) {
    var token = result.continuationToken;

    if(token) {
      var blobs = result.entries;
      var savedBlobs = 0;

      for (var i=0; i < blobs.length; i++) {
        var doc = blobs[i].name;
        var path = savePath + doc;
        console.log('   Saving ' + doc);

        blobService.getBlobToLocalFile(container, doc, path, function (error2) {
          savedBlobs++;
          if (error2) { 
            console.log(doc + "\n" + error2); // may not get right doc name
            unsavedBlobs.push(doc);
          }

          if (savedBlobs === blobs.length) {
            console.log('  Saved all blobs on this page.');
            getAllBlobs(options, token, callback);
          }
        });
      }
    }
    else {
      console.log('totalBlobs: ' + totalBlobs);
    }
  });
}

getAllBlobs(pageOptions, null, function() {
  console.log("All downloaded.\n\nPrinting unsaved blobs:");
  for (var i=0; i<unsavedBlobs.length; i++) { // fix this
    console.log(unsavedBlobs[i]);
  }
});
