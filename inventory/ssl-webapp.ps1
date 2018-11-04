Param( [string]$config )
$azure = Get-Content "conf\$config" | ConvertFrom-Json

#$ErrorActionPreference = "Stop"

$newCertPath = $azure.certPath
$newCertPass = $azure.certPass
$newCertThumb = $azure.certThumb

Import-Module AzureRM
Import-Module Azure

$user = $azure.user
$pass = ConvertTo-SecureString $azure.pass -AsPlainText -Force
$cred = New-Object -TypeName "System.Management.Automation.PSCredential" -ArgumentList $user, $pass
$account = Add-AzureRmAccount -Credential $cred
$subs = Get-AzureRmSubscription
#$subs

$certCount = 0
$certCountWeb = 0

foreach ($sub in $subs) {
  $subName = $sub.Name
  $context = Set-AzureRmContext -SubscriptionName $subName
  $resources = Get-AzureRmResource

  foreach ($resource in $resources) {
    $Name = $resource.ResourceName
    $Type = $resource.ResourceType.Substring(10)
    $GroupName = $resource.ResourceGroupName
    $Location = $resource.Location
    $subName = $subName -replace "'", ""

    if ($Type -match "Web/sites" -And $Type -notmatch "slots") {
      #if ($Name -match "il-portal-test" -or $Name -match "il-logger-test" -or $Name -match "il-studentdata-test") {
      #if ($Name -match "production") {
        $bindings = Get-AzureRmWebAppSSLBinding -ResourceGroupName $GroupName -WebAppName $Name
        if ($bindings.Name) {
        #if ($bindings.Name -match "test") {
        #if ($bindings.Name -match "load") {
          if ($bindings.Thumbprint -eq "AE43EC68DC33D4A026DA5A47AA18C17828442FFE") {
          #if ($bindings.Thumbprint -eq $newCertThumb) {
            $certCountWeb++
            <##>
            Write-Host ""
            Write-Host $Name - $GroupName
            foreach ($bind in $bindings) {
              #Write-Host "   "$bind.Name - $bindings.Thumbprint

              #New-AzureRmWebAppSSLBinding -ResourceGroupName $GroupName -WebAppName $Name -CertificateFilePath $newCertPath -CertificatePassword $newCertPass -Name $bind.Name
              #New-AzureRmWebAppSSLBinding -Name $bind.Name -ResourceGroupName $GroupName -Thumbprint $newCertThumb -WebAppName $Name
              #Remove-AzureRmWebAppSSLBinding -ResourceGroupName $GroupName -WebAppName $Name -Name $bind.Name -DeleteCertificate $false
              
            }
            
          }
        }
        else {
          <#
          Write-Host ""
          Write-Host "=============== no custom bindings ==============="
          Write-Host "   $Name - $GroupName"
          Write-Host "=================================================="
          #>
        }
      #}

    }

    if ($Type -match "Web/certificates" -And $Name -match "AE43EC68DC33D4A026DA5A47AA18C17828442FFE") {
      $certCount++
      Write-Host $Name - $GroupName
    }
  }
}

Write-Host "certCount:" $certCount  #36
Write-Host "certCountWeb:" $certCountWeb  #24


<#
#>