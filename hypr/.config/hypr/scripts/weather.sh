#!/usr/bin/env bash

FILE_PATH="$HOME/.cache/waybar/weather"
if [ -e "$FILE_PATH" ]; then
  echo "Already exists: $FILE_PATH"
else
  mkdir -p "$(dirname "$FILE_PATH")" && touch "$FILE_PATH"
  echo "Created: $FILE_PATH"
fi

source ~/utils/venv/bin/activate

python ~/utils/weather.py > $FILE_PATH

deactivate
