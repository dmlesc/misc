'use strict';

const fs = require('fs');

var resourcesByType = JSON.parse(fs.readFileSync('resourcesByType.json', 'utf8'));
var typeList = [];

for (var sub in resourcesByType) {
  var subTypes = resourcesByType[sub];
  for (var type in subTypes) {
    type = type.toLowerCase();
    if (typeList.indexOf(type) === -1)
      typeList.push(type);
  }
}

console.log('Unique Types: ' + typeList.length)

for (var i=0; i < typeList.length; i++) {
  console.log(typeList[i].replace(/\//g, '_') + ' nchar(10),');
}