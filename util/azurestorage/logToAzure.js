var fs = require('fs');
var spawn = require("child_process").spawn;

process.env['AZURE_STORAGE_ACCOUNT'] = 'name';
process.env['AZURE_STORAGE_ACCESS_KEY'] = 'key';

var azure = require('azure-storage');
var blobSvc = azure.createBlobService();

function logToLocal(container, str) {
  var name = new Date().getTime().toString();
  var pathzip = container + '/' + name + '.zip';
  
  fs.writeFile(name, str, function(err) {
    if (err) { console.error(err); }
    else {
      var child = spawn('/usr/bin/zip', [pathzip, name]);
        child.stdout.on("data", function(data) { /*console.log(data.toString());*/ });
        child.stderr.on("data", function(data) { console.error(data.toString()); });
        child.on("exit", function(code) {
          if (!code) { 
            logToAzure(container, name + '.zip', pathzip);
            fs.unlink(name, function(err) {
              if (err) { console.error(err); }
              else {}
            });
          }
          else { out = "error zipping stats"; }
        });
        child.stdin.end();
    }
  });
}

function logToAzure(container, name, pathzip) {
  blobSvc.createBlockBlobFromLocalFile(container, name, pathzip, function(error, result, response) {
    if (!error) { /*console.log(result);*/ /*console.log(response);*/ }
    else { console.log(error); }
  });
}

logToLocal('testmongo1','this is a test');



//console.log(__dirname);