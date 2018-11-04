var fs = require('fs');
var spawn = require("child_process").spawn;

function getFiles(path, exdir) {
  fs.readdir(path, function (err, list) {
    if (err) { console.error(err); }
    else { /*console.log(list);*/
      bulkUnzip(path, list, exdir);
    }
  });
}

function bulkUnzip(path, list, exdir) {
  for (var i=0; i < list.length; i++) {
    var child = spawn('/usr/bin/unzip', [path + "/" + list[i], "-d", exdir]);
      child.stdout.on("data", function(data) { /* console.log(data.toString()); */ });
      child.stderr.on("data", function(data) { console.error(data.toString()); });
      child.on("exit", function(code) {
        if (!code) { }
        else { console.log("error unzipping files"); }
      });
      child.stdin.end();
  }
}

getFiles("fileszipped0", "filesunzipped");