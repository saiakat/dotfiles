#!/usr/bin/env bash

root_used=$(df -h / | awk 'NR==2 {print $3}')
root_max=$(df -h / | awk 'NR==2 {print $2}')

cap_home=$(df -h /home | awk 'NR==2 {print $3 "/" $2}')
cap_home=$(df -h /home | awk 'NR==2 {print $3 "/" $2}')
cap_sata1=$(df -h /run/media/sata1 | awk 'NR==2 {print $3 "/" $2}')
cap_root=$(df -h / | awk 'NR==2 {print $3 "/" $2}')

echo "{\"text\": \" root: $cap_root\n home: $cap_home\n sata1: $cap_sata1\", \"tooltip\": \"root: $cap_root\nhome: $cap_home\nsata1: $cap_sata1\", \"rootUsed\": \"$root_used\", \"rootMax\": \"$root_max\"}"
