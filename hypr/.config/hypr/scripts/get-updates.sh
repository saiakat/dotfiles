#!/usr/bin/env bash

FILE_PATH="$HOME/.cache/waybar/updates"
if [ -e "$FILE_PATH" ]; then
  echo "Already exists: $FILE_PATH"
else
  mkdir -p "$(dirname "$FILE_PATH")" && touch "$FILE_PATH"
  echo "Created: $FILE_PATH"
fi

cache="$HOME/.cache/waybar/updates"
updates=$(checkupdates | wc -l)
echo $updates > $FILE_PATH
