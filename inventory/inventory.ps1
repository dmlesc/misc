$ErrorActionPreference = "Stop"

$db = "inventory"
$table = "table"
$server = "server"
$port = 1433
$db_user = "user"
$db_pass = "pass"
$date = Get-Date -format d
$insert = "INSERT INTO $table (Date, SubscriptionName, Name, Type, GroupName, Location) VALUES (CONVERT(VARCHAR(8), GETDATE(), 1), "

$user = "user"
$pass = ConvertTo-SecureString "pass" -AsPlainText -Force
$cred = New-Object -TypeName "System.Management.Automation.PSCredential" -ArgumentList $user, $pass
$account = Add-AzureRmAccount -Credential $cred
$subs = Get-AzureRmSubscription

foreach ($sub in $subs) {
  $subName = $sub.SubscriptionName
  $context = Set-AzureRmContext -SubscriptionName $subName
  $resources = Get-AzureRmResource
  $query = ""

  foreach ($resource in $resources) {
    $Name = $resource.ResourceName
    $Type = $resource.ResourceType.Substring(10)
    $GroupName = $resource.ResourceGroupName
    $Location = $resource.Location
    $subName = $subName -replace "'", ""
    $query += $insert + "'$subName', '$Name', '$Type', '$GroupName', '$Location');"
  }

  $Conn = New-Object System.Data.SqlClient.SqlConnection("Server=tcp:$server,$port;Database=$db;User ID=$db_user;Password=$db_pass;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;")
  $Conn.Open()
  $Cmd = New-Object system.Data.SqlClient.SqlCommand($query, $Conn)
  $Cmd.CommandTimeout = 120
  $Ds = New-Object system.Data.DataSet
  $Da = New-Object system.Data.SqlClient.SqlDataAdapter($Cmd)
  [void]$Da.fill($Ds)
  $Conn.Close()
}