#!/bin/bash
new_dir=`date +%m-%d-%y`
mkdir /pinger/old_logs/$new_dir
mv /pinger/logs/* /pinger/old_logs/$new_dir
