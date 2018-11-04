const dir = process.argv[2];
const fs = require('fs');
const chokidar = require('chokidar');

var watcher = chokidar.watch(dir, {
  ignored: /[\/\\]\./,
  persistent: true
});

var newFiles = {};
var interval = 7777;
var alreadyCheckingSize = false;
var alreadyProcessing = false;

watcher
  .on('error', (error) => { error('watcher error: ', error); })
  .on('add', (path) => { 
    //console.log('added: ' + path);
    newFiles[path] = {};
    var stats = fs.statSync(path);
    newFiles[path].size = stats.size;
    setTimeout(hasSizeChanged, interval);
  })
  .on('change', (path, stats) => {
    if (stats) {
      //console.log('changed: ' + path + ' - size: ' + stats.size);
    }
  });

  
function hasSizeChanged() {
  if (!alreadyCheckingSize) {
    alreadyCheckingSize = true;

    for (var path in newFiles) {
      var size = newFiles[path].size;
      var stats = fs.statSync(path);
      if (size === stats.size) {
        console.log(path);
        delete newFiles[path];
      }
      else {
        //console.log('changed: ' + path + ' - size: ' + stats.size);
        newFiles[path].size = stats.size;
        setTimeout(hasSizeChanged, interval);
      }
    }
    alreadyCheckingSize = false;
  }
}