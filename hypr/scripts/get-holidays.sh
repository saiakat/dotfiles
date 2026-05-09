#!/usr/bin/env bash

FILE_PATH="$HOME/.cache/waybar/holidays"
if [ -e "$FILE_PATH" ]; then
  echo "Already exists: $FILE_PATH"
else
  mkdir -p "$(dirname "$FILE_PATH")" && touch "$FILE_PATH"
  echo "Created: $FILE_PATH"
fi
# 1. Path to the activation script
source ~/dotfiles/utils/venv/bin/activate

# 2. Run your script (it will now use the venv's python)
python ~/dotfiles/utils/holidays/get_holidays.py > $FILE_PATH

# 3. Optional: deactivate when finished
deactivate
