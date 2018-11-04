'use strict';

const conf = require('./conf/' + process.argv[2]);
const fields = require('./fields');
const clientFields = fields.clientFields;
const sql = require('mssql');


const config = {
  user: conf.user,
  password: conf.password,
  server: conf.server,
  database: conf.database,
  options: conf.options
};

const pool = new sql.ConnectionPool(config, err => {
  if (err)
    console.log(err);
  else {


    const table = new sql.Table(conf.table);
    table.create = true;

    /*
    table.columns.add('Activity', sql.VarChar(50), {nullable: true});
    table.columns.add('CpuCores', sql.Int, { nullable: true });
    table.columns.add('CpuModel', sql.VarChar(50), {nullable: true});
    table.columns.add('CpuSpeed', sql.Int, { nullable: true });
    table.columns.add('Dataset', sql.VarChar(50), {nullable: true});
    table.columns.add('DeviceId', sql.VarChar('MAX'), {nullable: true});
    table.columns.add('DeviceModel', sql.VarChar('MAX'), {nullable: true});
    table.columns.add('EngineAddress', sql.VarChar('MAX'), {nullable: true});
    table.columns.add('Exception', sql.VarChar('MAX'), {nullable: true});
    table.columns.add('GpuVendor', sql.VarChar(50), {nullable: true});
    table.columns.add('GpuVersion', sql.VarChar(50), {nullable: true});
    table.columns.add('Measurement', sql.Int, { nullable: true });
    table.columns.add('MeasurementType', sql.VarChar(50), { nullable: true });
    table.columns.add('Message', sql.VarChar('MAX'), {nullable: true});
    table.columns.add('OperatingSystem', sql.VarChar('MAX'), {nullable: true});
    table.columns.add('OSArchitecture', sql.VarChar(50), {nullable: true});
    table.columns.add('OSFamily', sql.VarChar(50), {nullable: true});
    table.columns.add('OSVersion', sql.VarChar(50), {nullable: true});
    table.columns.add('Platform', sql.VarChar(50), {nullable: true});
    table.columns.add('PlatformName', sql.VarChar(50), {nullable: true});
    table.columns.add('PlatformVersion', sql.VarChar(50), {nullable: true});
    table.columns.add('Ram', sql.Int, { nullable: true });
    table.columns.add('SessionId', sql.VarChar(50), {nullable: true});
    table.columns.add('Severity', sql.VarChar(50), {nullable: true});
    table.columns.add('ShaderGenerations', sql.Int, { nullable: true });
    table.columns.add('SiteCode', sql.VarChar(50), {nullable: true});
    table.columns.add('Stack', sql.VarChar(50), {nullable: true});
    table.columns.add('TimeStamp', sql.VarChar(50), {nullable: true});
    table.columns.add('UserAgent', sql.VarChar('MAX'), {nullable: true});
    table.columns.add('Username', sql.VarChar('MAX'), {nullable: true});
    table.columns.add('Version', sql.VarChar(50), {nullable: true});
    */

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


    table.rows.add('Activity', 0, 'CpuModel', 0, 'Dataset', 'DeviceId', 'DeviceModel', 'EngineAddress', 'Exception', 'GpuVendor', 'GpuVersion', 0, 'MeasurementType', 'Message', 'OperatingSystem', 'OSArchitecture', 'OSFamily', 'OSVersion', 'Platform', 'PlatformName', 'PlatformVersion', 0, 'SessionId', 'Severity', 'ShaderGenerations', 'SiteCode', 'Stack', '2017-06-22T06:12:08.2Z', 'UserAgent', 'Username', 'Version');
    
    const request = new sql.Request(pool);
    request.bulk(table, (err, result) => {
      if (err)
        console.log(err);
      else {
        console.dir(result)
        pool.close();
      }
        
    });





  }
});

pool.on('error', err => {
  console.log(err);
})


process.on('uncaughtException', (err) => {
  console.log(err);
});