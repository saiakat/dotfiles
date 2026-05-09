#!/usr/bin/env bash

cap_home=$(df -h /home | awk 'NR==2 {print $3 "/" $2}')
cap_root=$(df -h / | awk 'NR==2 {print $3 "/" $2}')

echo "{\"text\": \" root: $cap_root\n home: $cap_home\", \"tooltip\": \"root: $cap_root\nhome: $cap_home\"}"

