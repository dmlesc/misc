C:\Windows\System32\inetsrv\appcmd.exe stop site /site.name:"services.imaginelearning.net"
C:\Windows\System32\inetsrv\appcmd.exe recycle apppool /apppool.name:"services.imaginelearning.net.2011.4"
C:\Windows\System32\inetsrv\appcmd.exe recycle apppool /apppool.name:"services.imaginelearning.net"
C:\Windows\System32\inetsrv\appcmd.exe start site /site.name:"services.imaginelearning.net"