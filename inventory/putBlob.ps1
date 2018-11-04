$ErrorActionPreference = "Stop"
 
$SN = "SubscriptionName"
$SAN = "StorageAccountName"
$RGN = "ResourceGroupName"

$container = "inventory"
$out = "d:\src\ps\out"
$byName = "resourcesByName.json"
$byType = "resourcesByType.json"

$ARMC = Set-AzureRmContext -SubscriptionName $SN
$ARMCSA = Set-AzureRmCurrentStorageAccount -ResourceGroupName $RGN -StorageAccountName $SAN

function putObjToJsonBlob {
  param( [string]$obj, [string]$file, [string]$c )

  $obj | ConvertTo-Json -Compress | Out-File $file
  return Set-AzureStorageBlobContent -Container $c -File $file -Force
}

$blobByName = putObjToJsonBlob -obj $currentByName -file "$out\$byName" -c $container
$blobByName

$blobByType = putObjToJsonBlob -obj $currentByType -file "$out\$byType" -c $container
$blobByType