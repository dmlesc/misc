$db = "db"
$table = "dbo.table"
$server = "server"
$user = "user"
$pass = "pass"
 
$insert = "INSERT INTO $table (Date, SubscriptionName, ResourceName) VALUES (GETDATE(), 'abc123', 'name')"

Invoke-Sqlcmd -Database $db -ServerInstance $server -Username $user -Password $pass -OutputSqlErrors $True -Query $insert -Verbose
