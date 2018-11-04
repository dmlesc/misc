'use strict';

const conf = require('./conf/' + process.argv[2]);
const fs = require('fs');
const zlib = require('zlib');
const fields = require('./fields');
const clientFields = fields.clientFields;
const sql = require('mssql');

const docPath = './logs/client/';
const processedPath = './logs/processed/';
//const docPath = "./logs/test/";
var files = fs.readdirSync(docPath);
var fileCount = 0;
var logCount = 0;

const config = {
  user: conf.user,
  password: conf.password,
  server: conf.server,
  database: conf.database,
  options: conf.options
};

//const pool = new sql.ConnectionPool(config);
//pool.on('error', err => { console.log(err); });

function loadData(file) {
  fileCount++;
  var logs = JSON.parse(zlib.gunzipSync(fs.readFileSync(docPath + file)));

  console.log(file, logs.length);

  const table = new sql.Table(conf.table);
  table.create = true;

  for (var i=0; i<clientFields.length; i++) {
    var tuple = clientFields[i];
    var type;

    if (tuple[1] == 'MAX')
      type = sql.VarChar('MAX')
    else if (tuple[1] == 'int')
      type = sql.Int;
    else 
      type = sql.VarChar(50);
    
    table.columns.add(tuple[0], type, tuple[2]);
  }

  for (var i=0; i<logs.length; i++) {
//  for (var i=5300; i<5301; i++) {
    logCount++;
    var log = logs[i];
    var rowData = copy(fields.clientNulls);

    Object.keys(log).forEach( (field) => {
      var value = log[field];

      if (field === 'OsArchitecture')
        field = 'OSArchitecture';
      if (field === 'SiteCode')
        value = value.split(' ')[0];

      rowData[field] = value;

      if (log['Measurement']) {

        var message = log['Message'];
        var type = null;

        if (message.includes('Manager API round trip time'))
          type = 'ManagerAPI';
        else if (message.includes('Get Next Activity round trip time'))
          type = 'GetNextActivity';
        else if (message.includes('Activity Completed round trip time'))
          type = 'ActivityCompleted';
        else if (message.includes('Activity Download Media Time'))
          type = 'ActivityDownloadMedia';
        else if (message.includes('Total Activity Load Time'))
          type = 'TotalActivityLoad';
        else if (message.includes('MediaThroughput (Kb/s)'))
          type = 'MediaThroughput';

        rowData['MeasurementType'] = type;
      }
    });

    //console.log(rowData);

    table.rows.add(
      rowData.Activity, rowData.CpuCores, rowData.CpuModel, rowData.CpuSpeed,
      rowData.Dataset, rowData.DeviceId, rowData.DeviceModel, rowData.EngineAddress,
      rowData.Exception, rowData.GpuVendor, rowData.GpuVersion, rowData.Measurement,
      rowData.MeasurementType, rowData.Message, rowData.OperatingSystem, rowData.OSArchitecture,
      rowData.OSFamily, rowData.OSVersion, rowData.Platform, rowData.PlatformName,
      rowData.PlatformVersion, rowData.Ram, rowData.SessionId, rowData.Severity,
      rowData.ShaderGenerations, rowData.SiteCode, rowData.Stack, rowData.TimeStamp,
      rowData.UserAgent, rowData.Username, rowData.Version
    );

    process.stdout.write(fileCount + ' - ' + logCount + '\r');
  }

  const pool = new sql.ConnectionPool(config, (err) => {
    if (err) { console.log(err); }
    else {
      console.log('bulk inserting...');
      const request = new sql.Request(pool);
      request.bulk(table, (err, result) => {
        pool.close();

        if (err) { console.log(err); }
        else {
          console.log(result);

          fs.renameSync(docPath + file, processedPath  + file);

          if (files.length)
            loadData(files.shift());
          else {
            //pool.close();
            console.log('done');
          }
        }
      });
    }
  });
  //pool.on('error', (err) => { console.log(err); });
}


loadData(files.shift());

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

process.on('uncaughtException', (err) => {
  console.log(err);
});