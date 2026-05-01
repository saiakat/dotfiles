#!/usr/bin/env bash
# 1. Path to the activation script
source ~/utils/venv/bin/activate

# 2. Run your script (it will now use the venv's python)
python ~/utils/get_holidays.py > $HOME/.cache/waybar/holidays

# 3. Optional: deactivate when finished
deactivate
