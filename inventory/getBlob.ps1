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

function getBlobToJson { param( [string]$c, [string]$b, [string]$d )
  $blob = Get-AzureStorageBlobContent -Container $c -Blob $b -Destination $d -Force
  $obj = Get-Content -Raw -Path $d | ConvertFrom-Json
  $ht = @{}
  foreach ($key in $obj) {
    $key | Get-Member -MemberType *Property | % {
      $ht.($_.Name) = $key.($_.Name)
    }
  }
  return $ht
}

$previousByName = getBlobToJson -c $container -b $byName -d "$out\$byName"
$previousByName.GetType()

$previousByType = getBlobToJson -c $container -b $byType -d "$out\$byType"
$previousByType.GetType()


#Set-AzureStorageBlobContent -Container $container -File "d:\src\ps\out\inventory.json"