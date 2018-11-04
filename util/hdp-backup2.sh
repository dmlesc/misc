#!/bin/bash

/hdp/bin/hdp-manage.sh backup create

last_dir=$(ls -tr /hdp/backups | tail -1)
new_dir=`date +%y%m%d`

cd /hdp/backups/$last_dir
smbclient //il2backup1/backup$ -U it.backup%1m@g1n3-IB -c "cd SalesRequests;mkdir $new_dir;cd $new_dir;put data-db.bz2;put files.tar.bz2;exit"

