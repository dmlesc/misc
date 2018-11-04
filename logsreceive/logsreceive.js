'use strict';

const env = process.argv[2];
const conf = require('./conf/' + env);

const node_statsd = require('node-statsd');
const statsd = new node_statsd({
  host: conf.statsd.host,
  port: conf.statsd.port,
  prefix: conf.statsd.prefix + '.' + env
});

const elasticsearch = require('elasticsearch');
const elastic = new elasticsearch.Client({
  host: conf.elasticHost
  //, log: 'trace'
});

const http = require('http');
const fs = require('fs');

const infoLog = './log/info.log';
const errorLog = './log/error.log';

var logsQueue = [ [], [] ];

const server = http.createServer((req, res) => {
  var req_total = process.hrtime(); //stats
  //log([req.url]);
  var url = req.url;
  var code = 200;
  var data = 'received';

  var body = '';

  req.on('error', (err) => { console.error(err); });
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    //console.log('req headers: ' + JSON.stringify(req.headers) + '\n');
    //console.log('req body raw:' + body + '\n');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (!body) {
      log(['empty body']);
      data = 'empty body';
    }
    else {
      try {
        body = JSON.parse(body);
        body.timestamp = new Date().toJSON();
        logsQueue[0].push(body);
        //console.log('log pushed to queue');
      }
      catch (e) { // console.log(e);
        log(['error parsing request']);
        code = 400;
        data = 'error parsing request';
      }
    }

    respond(res, code, data); 
  });
});

function respond(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'text/plain' });
  //console.log('res headers: ' + JSON.stringify(res.getHeaders()) + '\n');
  res.end(data);
}

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(8000);

function log(message) {
  var text = new Date().toJSON() + ' - ' + message.join(' - ') + '\n';
  console.log(text);
  
  //fs.appendFile(infoLog, text, (err) => {
  //  if (err) { error(err + text); }
  //  else { /*console.log('log appended');*/ }
  //});
  
}
function error(message) {
  var text = new Date().toJSON() + ' - ' + message + '\n';
  console.log(text);

  //fs.appendFile(errorLog, text, (err) => {
    //if (err) { console.error(err); }
    //else { /*console.log('error appended');*/ }
  //});
}
function getTime(hrtimeObj) {
  var diff = process.hrtime(hrtimeObj);
  return Math.round(diff[0] * 1000 + diff[1] / 1000000);
}
statsd.socket.on('error', (err) => {
  error(err);
  statsd.increment('.error.statsd'); //stats
});
process.on('uncaughtException', (err) => {
  error(err);
  statsd.increment('.error.uncaughtException'); //stats
});


function memoryUsage() {
  var mem = process.memoryUsage();
  statsd.timing('.mem.rss', mem.rss); //stats
  statsd.timing('.mem.heapTotal', mem.heapTotal); //stats
  statsd.timing('.mem.heapUsed', mem.heapUsed); //stats
}
var memInterval = setInterval(memoryUsage, 10000);


function flushLogs() {
  console.log('flushLogs');

  if (logsQueue[0].length) {
    var logs = logsQueue.shift();
    logsQueue.push([]);
    console.log('#logs: ', logs.length);

    var bulk = [];

    for (var i=0; i<logs.length; i++) {
      var log = logs[i];
      var date = log.timestamp.split('T')[0];
      var index = {};
      index._index = 'portallogs-' + date;
      index._type = 'portallogs';

      var action = {};
      action.index = index;
      bulk.push(action);
      bulk.push(log);
    }
    console.log('bulk ready');
    elasticBulk(bulk);
  }
}

var flushInterval = setInterval(flushLogs, conf.flushFreq);


function elasticBulk(bulk) {
  var elastic_bulk = process.hrtime(); //stats

  elastic.bulk({ body: bulk }, (err, res) => {
    statsd.timing('elastic_bulk', getTime(elastic_bulk)); //stats
    if (err) {
      statsd.increment('elastic_bulk_err'); //stats
      error(err);
    }
    else {
      //console.log(res);
      statsd.increment('elastic_bulk'); //stats
      console.log('bulk inserted');
    }
  });
}


/*
  var elastic_bulk = process.hrtime(); //stats
  statsd.timing('elastic_bulk', getTime(elastic_bulk)); //stats


*/