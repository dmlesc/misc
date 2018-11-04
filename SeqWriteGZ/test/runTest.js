'use strict';

var request = require('request');
var fs = require('fs');

var startActivity = {
  StudentId: 'placeholder',
  ActivityStartedCollection: [{
    Product: 'ELI',
    Lesson: 'pizzazzy-jazz-buzz-fuzz-razzmatazzes',
    SequenceNode: 'zyzzyvas-juju-hajj-fizz-quizzicality',
    Activity: 'CompressionTest',
    DataSet: 1,
    DateTime: '1981-02-06T19:36:91.123321+00:00'
  }],
  StudentLessonStateCollection: [{
    ActivatedRevision: 4,
    AnyBranchEverFailed: false,
    CurrentBranch: 'Main',
    CurrentNode: 'zyzzyvas-juju-hajj-fizz-quizzicality',
    Lesson: 'pizzazzy-jazz-buzz-fuzz-razzmatazzes',
    LessonState: 'Active',
    LessonStateTransitionReason: 'IDontNeedReason',
    DateTime: '1981-02-06T19:36:91.123321+00:00'
  }]
}

var completeActivity = {
  StudentId: 'placeholder',
  ActivityCountedCollection: [{
    Product: 'ELI',
    LessonBranch: 'Main',
    Activity: 'CompressionTest',
    Lesson: 'pizzazzy-jazz-buzz-fuzz-razzmatazzes',
    SequenceNode: 'zyzzyvas-juju-hajj-fizz-quizzicality',
    DataSet: 1,
    DateTime: '1981-02-06T19:36:91.123321+00:00',
    ElapsedSeconds: 23.32,
    ActivitySpecificData: '',
    ActivityPurpose: 1,
    SessionTime: 101
  }]
}

var options = {
  uri: 'placeholder',
  method: 'POST',
  json: 'placeholder'
};


var requests = [];
var responses = [];
var uri = 'http://10.0.0.4/';

var blobList = JSON.parse(fs.readFileSync('blobList', 'utf8'));

for (var i=0; i < blobList.length; i++) {
  var opt = JSON.parse(JSON.stringify(options));
  var start = JSON.parse(JSON.stringify(startActivity));
  start.StudentId = blobList[i];
  opt.uri = uri + 'startActivity';
  opt.json = start;
  requests.push(opt);

  var opt = JSON.parse(JSON.stringify(options));
  var complete = JSON.parse(JSON.stringify(completeActivity));
  complete.StudentId = blobList[i];
  opt.uri = uri + 'completeActivity';
  opt.json = complete;
  requests.push(opt);
}

function sendRequest(req) {
  var time = process.hrtime();
  request(req, function (error, response, body) {
    var diff = process.hrtime(time);
    if (error)
      console.log(error);
    else {
      var res = body;
      //res.code = response.statusCode;
      res.e2e = diff;
      console.log(JSON.stringify(res));
      responses.push(res);
      var req = requests.shift();
      if (req)
        sendRequest(req);
      else
        processResults();
    }
  });
}

sendRequest(requests.shift());

function processResults() {
  var extractedByKey = {};
  var keys = [];
  var res0 = responses[0];
  for (var key in res0) {
    if (key !== "id") {
      keys.push(key);
      extractedByKey[key] = [];
    }
  }
  
  var serverTime = [];
  
  for (var i=0; i<responses.length; i++) {
    var totalServerTime = 0;
    var res = responses[i];
    for (var j=0; j<keys.length; j++) {
      var key = keys[j];
      var diff = res[key];
      var milliseconds = Math.round((diff[0] * 1e9 + diff[1]) * 1e-6);
      extractedByKey[key].push(milliseconds);

      if (key !== 'e2e')
        totalServerTime += milliseconds;
    }
    serverTime.push(totalServerTime);
  }

  var metrics = {};

  var result = getMaxMinAvg(serverTime);
  console.log('serverTime:\n  avg: ' + result.avg + '  max: ' + result.max + '  min: ' + result.min);
  metrics.serverTime = { max: result.max, min: result.min, avg: result.avg };

  for (var metric in extractedByKey) {
    var times = extractedByKey[metric];
    var result = getMaxMinAvg(times);
    console.log(metric + ':\n  avg: ' + result.avg + '  max: ' + result.max + '  min: ' + result.min);
      metrics[metric] = { max: result.max, min: result.min, avg: result.avg };
  }

  var suffix = new Date().getTime().toString();

  if (keys.indexOf('gunzip') !== -1) {
    var getBlob_gunzip_avg = metrics.getBlob.avg + metrics.gunzip.avg;
    metrics.getBlob_gunzip = getBlob_gunzip_avg;
    console.log('getBlob_gunzip\n  avg: ' + getBlob_gunzip_avg);
    suffix += '_gunzip';
  }
  
  if (keys.indexOf('gzip') !== -1) {
    var gzip_createBlob_avg = metrics.gzip.avg + metrics.createBlob.avg;
    metrics.gzip_createBlob = gzip_createBlob_avg;
    console.log('gzip_createBlob\n  avg: ' + gzip_createBlob_avg);
    suffix += '_gzip';
  }

  if (keys.indexOf('deleteLocalBlob') !== -1) {
    var gzip_create_delete_avg = metrics.deleteLocalBlob.avg + metrics.createBlob.avg;
    metrics.gzip_create_delete = gzip_create_delete_avg;
    console.log('gzip_create_delete\n  avg: ' + gzip_create_delete_avg);
    suffix += '_local';
  }

  fs.writeFileSync('./metrics/metrics_' + suffix, JSON.stringify(metrics));
  fs.writeFileSync('./metrics/metrics_' + suffix + '_raw', JSON.stringify(responses));
}

function getMaxMinAvg(times) {
    var result = {};

    result.max = Math.max.apply(null, times);
    result.min = Math.min.apply(null, times);

    var total = 0;
    for (var i=0; i<times.length; i++)
      total += times[i];
    result.avg = Math.round(total / times.length);

    return result;
}