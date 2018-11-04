$db = "db"
$server = "server"
$user = "user"
$pass = "pass"
 
$alter = "ALTER TABLE dbo.ByResourceType ADD Test1 nchar(10)"

Invoke-Sqlcmd -Database $db -ServerInstance $server -Username $user -Password $pass -OutputSqlErrors $True -Query $alter -Verbose

<#
IF NOT EXISTS(
    SELECT *
    FROM sys.columns 
    WHERE Name      = N'Test2'
      AND Object_ID = Object_ID(N'dbo.ByResourceType'))
BEGIN
    -- Column Exists
	ALTER TABLE dbo.ByResourceType ADD Test2 nchar(10)
END
#>