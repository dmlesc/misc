#!/bin/bash

#Create a backup of helpdesk
/hdp/bin/hdp-manage.sh backup create

# Get the latest directory from the backup folder:
echo "Finding Latest Directory"
last_dir=$(ls -tr /hdp/backups | tail -1)

#Make a folder for the backup
echo "Creating folder `date +%y%m%d`"

mkdir /mnt/backupserver/Helpdesk/`date +%y%m%d`

# Copy the directory to /mnt/backupserver/Helpdesk
echo "Backing up"
cp -r /hdp/backups/$last_dir/data-db.bz2 /mnt/backupserver/Helpdesk/`date +%y%m%d`
cp -r /hdp/backups/$last_dir/files.tar.bz2 /mnt/backupserver/Helpdesk/`date +%y%m%d`

# Erase Files older than 10 days

# Erase the local backup files older than 7 days.
find /hdp/backups/  -type d -ctime +7 -exec rm -rf {} \;

#Erase the files on the backupserver older than 7 days
find /mnt/backupserver/Helpdesk  -type d -ctime +7 -exec rm -rf {} \;


echo "Finished"
