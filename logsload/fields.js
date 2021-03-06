module.exports = {
  clientFields: [
    ['Activity', 'string', {nullable: true}],
    ['CpuCores', 'int', { nullable: true }],
    ['CpuModel', 'string', {nullable: true}],
    ['CpuSpeed', 'int', { nullable: true }],
    ['Dataset', 'string', {nullable: true}],
    ['DeviceId', 'MAX', {nullable: true}],
    ['DeviceModel', 'MAX', {nullable: true}],
    ['EngineAddress', 'MAX', {nullable: true}],
    ['Exception', 'MAX', {nullable: true}],
    ['GpuVendor', 'string', {nullable: true}],
    ['GpuVersion', 'MAX', {nullable: true}],
    ['Measurement', 'int', { nullable: true }],
    ['MeasurementType', 'string', { nullable: true }],
    ['Message', 'MAX', {nullable: true}],
    ['OperatingSystem', 'MAX', {nullable: true}],
    ['OSArchitecture', 'string', {nullable: true}],
    ['OSFamily', 'string', {nullable: true}],
    ['OSVersion', 'string', {nullable: true}],
    ['Platform', 'string', {nullable: true}],
    ['PlatformName', 'string', {nullable: true}],
    ['PlatformVersion', 'string', {nullable: true}],
    ['Ram', 'int', { nullable: true }],
    ['SessionId', 'string', {nullable: true}],
    ['Severity', 'string', {nullable: true}],
    ['ShaderGenerations', 'int', { nullable: true }],
    ['SiteCode', 'string', {nullable: true}],
    ['Stack', 'string', {nullable: true}],
    ['TimeStamp', 'string', {nullable: true}],
    ['UserAgent', 'MAX', {nullable: true}],
    ['Username', 'MAX', {nullable: true}],
    ['Version', 'string', {nullable: true}]
  ],
  clientNulls: {
    Activity: null,
    CpuCores: null,
    CpuModel: null,
    CpuSpeed: null,
    Dataset: null,
    DeviceId: null,
    DeviceModel: null,
    EngineAddress: null,
    Exception: null,
    GpuVendor: null,
    GpuVersion: null,
    Measurement: null,
    MeasurementType: null,
    Message: null,
    OperatingSystem: null,
    OSArchitecture: null,
    OSFamily: null,
    OSVersion: null,
    Platform: null,
    PlatformName: null,
    PlatformVersion: null,
    Ram: null,
    SessionId: null,
    Severity: null,
    ShaderGenerations: null,
    SiteCode: null,
    Stack: null,
    TimeStamp: null,
    UserAgent: null,
    Username: null,
    Version: null
  }
}