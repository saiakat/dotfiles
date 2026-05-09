#!/usr/bin/env bash

if [ -d "~/dotfiles/utils/venv/" ]; then
  echo "venv exists" 
else
  python -m venv ~/dotfiles/utils/venv
fi

py_deps=("requests" "dotenv")

source ~/utils/venv/bin/activate

for dep in "${py_deps[@]}"; do
  pip install dep
done

deactivate

lua_deps=("luafilesystem")

for dep in "${lua_deps[@]}"; do
  luarocks install dep
done
