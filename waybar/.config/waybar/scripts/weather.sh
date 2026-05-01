#!/usr/bin/env bash
# 1. Path to the activation script
source ~/utils/venv/bin/activate

# 2. Run your script (it will now use the venv's python)
python ~/utils/weather.py

# 3. Optional: deactivate when finished
deactivate
