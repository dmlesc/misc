/hdp/bin/hdp-manage.sh backup create

last_dir=$(ls -tr /hdp/backups | tail -1)
new_dir=`date +%y%m%d`

mkdir /mnt/backupserver/$new_dir
cd /hdp/backups/$last_dir

cp data-db.bz2 /mnt/backupserver/$new_dir
cp files.tar.bz2 /mnt/backupserver/$new_dir

find /hdp/backups/  -type d -ctime +1 -exec rm -rf {} \;
find /mnt/backupserver/  -type d -ctime +30 -exec rm -rf {} \;
