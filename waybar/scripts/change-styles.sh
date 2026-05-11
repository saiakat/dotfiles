#!/usr/bin/env bash

style=$1
flag=$2

if [ $flag -eq 1 ]; then
  if [ -L ~/.config/ags/bar/style.css ]; then
    echo $flag
    rm ~/.config/ags/bar/style.css
    cp ~/.config/ags/bar/styles/$style ~/.config/ags/bar/style.css
  else
    cp ~/.config/ags/bar/styles/$style ~/.config/ags/bar/style.css
  fi
elif [ -L ~/.config/waybar/style.css ]; then
  rm ~/.config/waybar/style.css
  cp ~/.config/waybar/styles/$style ~/.config/waybar/style.css
else
  cp ~/.config/waybar/styles/$style ~/.config/waybar/style.css
fi

exit 0
