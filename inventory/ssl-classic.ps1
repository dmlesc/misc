Param( [string]$config )
$azure = Get-Content "conf\$config" | ConvertFrom-Json

$ErrorActionPreference = "Stop"

Import-Module Azure

$user = $azure.user
$pass = ConvertTo-SecureString $azure.pass -AsPlainText -Force
$cred = New-Object -TypeName "System.Management.Automation.PSCredential" -ArgumentList $user, $pass
$account = Add-AzureAccount -Credential $cred
$subs = Get-AzureSubscription
#$subs

$newCertPath = $azure.certPath
$newCertPass = $azure.certPass

$countOldCert = 0
$countNewCert = 0

foreach ($sub in $subs) {
  Write-Host $sub.SubscriptionName
  Select-AzureSubscription -SubscriptionName $sub.SubscriptionName

  $services = Get-AzureService
  foreach ($service in $services) {
    #Write-Host "  "$service.ServiceName

    $certs = Get-AzureCertificate -ServiceName $service.ServiceName
    foreach ($cert in $certs) {
      if ($cert.Thumbprint -eq "AE43EC68DC33D4A026DA5A47AA18C17828442FFE") {
        Write-Host "  "$service.ServiceName
        Write-Host "     "$cert.Thumbprint
      }

      if ($cert.Thumbprint -eq "AE43EC68DC33D4A026DA5A47AA18C17828442FFE") {
        <#
        Add-AzureCertificate -CertToDeploy $newCertPath -ServiceName $service.ServiceName -Password $newCertPass
        Write-Host ""
        Write-Host "     added new cert for "$service.ServiceName
        #>

        $countOldCert++
      }

      if ($cert.Thumbprint -eq "E099634CC01F5D5C53580E0DE36B671E36E1EAA1") {
        $countNewCert++
      }

      
    }
  }
}

Write-Host "countOldCert:" $countOldCert  #20
Write-Host "countNewCert:" $countNewCert  #20


<#
#>