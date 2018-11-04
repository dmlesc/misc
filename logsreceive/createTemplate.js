'use strict';

const env = process.argv[2];
const conf = require('./conf/' + env);

const elasticsearch = require('elasticsearch');
const elastic = new elasticsearch.Client({
  host: conf.elasticHost
  //, log: 'trace'
});

var params = {
  name: 'portallogs',
  //timeout: '10m',
  body: {
    template: 'portallogs-*',
    settings: {
      number_of_shards: 1,
      number_of_replicas: 0
    },
    mappings: {
        portallogs: {
        properties: {
          timestamp: { type: 'date', format: 'strict_date_optional_time' },
          username : { type : 'keyword' },
          code : { type : 'keyword' },
          message : { type : 'text' },
          service : { type : 'keyword' },
          backend_url: { type : 'text' },
          ui_url: { type : 'text' },
          ip: { type: 'keyword' }
        }
      }
    }
  }
};


elastic.indices.putTemplate(params, (err, res) => {
  if (err)
    console.log(err);
  else
    console.log(res);
});

process.on('uncaughtException', (err) => {
  console.log(err);
});