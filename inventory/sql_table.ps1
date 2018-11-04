$db = "db"
$server = "server"
$user = "user"
$pass = "pass"
 
$CreateTable = "CREATE TABLE Resources1 (
  Date datetime,
  SubscriptionName varchar(100) NOT NULL,
  Name varchar(100),
  Type varchar(100),
  GroupName varchar(100),
  Location varchar(100),
)"

Invoke-Sqlcmd -Database $db -ServerInstance $server -Username $user -Password $pass -OutputSqlErrors $True -Query $CreateTable -Verbose


<#
SELECT Date, SubscriptionName, Name, Type, GroupName, Location
    FROM [dbo].[Resources]
    WHERE Date >= Convert(datetime, '2017-04-14')
#>