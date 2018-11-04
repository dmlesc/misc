function GetTime {
   $dt = Get-Date -Format HH:mm:ss.fff
   $time = "{0:G}" -f [datetime]$dt
   return $time
}


GetTime

Get-Date -format d