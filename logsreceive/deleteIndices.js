'use strict';

const env = process.argv[2];
const conf = require('./conf/' + env);

var date = process.argv[3];

const elasticsearch = require('elasticsearch');
const elastic = new elasticsearch.Client({
  host: conf.elasticHost
  //, log: 'trace'
});

var indices = ['portallogs-2017-08-22'];

elastic.indices.delete({ index: indices }, (err, res) => {
  if (err)
    console.log(err);
  else {
    console.log(res);
  }
});

process.on('uncaughtException', (err) => {
  console.log(err);
});