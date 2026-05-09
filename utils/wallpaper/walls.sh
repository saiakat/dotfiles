#!/usr/bin/env bash

if [[ ("$1" == "s" || "$1" == "slideshow") && "$2" == "on" ]]; then
  lua ~/dotfiles/utils/wallpaper/wallpapers.lua "$@" > /dev/null 2>&1 & disown
else
  lua ~/dotfiles/utils/wallpaper/wallpapers.lua "$@"
fi
