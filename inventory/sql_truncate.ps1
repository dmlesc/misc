$db = "db"
$table = "dbo.table"
$server = "server"
$user = "user"
$pass = "pass"
 
$query = "TRUNCATE TABLE $table;"

Invoke-Sqlcmd -Database $db -ServerInstance $server -Username $user -Password $pass -OutputSqlErrors $True -Query $query -Verbose