#!/usr/bin/env bash

FILE_PATH="$HOME/.cache/waybar/updates"
if [ -e "$FILE_PATH" ]; then
  echo "Already exists: $FILE_PATH"
else
  mkdir -p "$(dirname "$FILE_PATH")" && touch "$FILE_PATH"
  echo "Created: $FILE_PATH"
fi

updates=$(checkupdates | wc -l)
if [ $updates == 0 ]; then
  echo "{\"text\": \"󰅠\", \"tooltip\": \"All packages up to date\"}" > $FILE_PATH
elif [ $updates == 1 ]; then
  echo "{\"text\": \"󰅢\", \"tooltip\": \"1 Update available\"}" > $FILE_PATH
else
  echo "{\"text\": \"󰅢\", \"tooltip\": \"$updates Updates available\"}" > $FILE_PATH
fi
