"use strict";

process.env['AZURE_STORAGE_ACCOUNT'] = 'name';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'key';

var azure = require('azure-storage');

var blobSvc = azure.createBlobService();

blobSvc.createBlockBlobFromText('mycontainer1', 'myblob6.txt', 'test string', function(error, result, response){
   if(!error){
    // file uploaded
      console.log(result);
      console.log(response);
  }
  else {
     console.log(error);
  }
});



blobSvc.listBlobsSegmented('mycontainer1', null, function(error, result, response){
   if(!error){
      // result.entries contains the entries
      // If not all blobs were returned, result.continuationToken has the continuation token.
      //console.log(response);
      //console.log(result.entries);
      var blobs = result.entries;
      
      for (var i=0; i<blobs.length; i++) {
         console.log(blobs[i].name);
      }
   }
   else {
      console.log(error);
   }
});