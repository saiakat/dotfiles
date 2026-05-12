#!/usr/bin/env bash

future_theme="catppuccin-mocha-sapphire-standard+default"
default_theme="catppuccin-mocha-flamingo-standard+default"
stylesheet=$HOME/.config/ags/bar/style.css
stylesheet_w=$HOME/.config/waybar/style.css
stylesheet_nc=$HOME/.config/swaync/style.css
style=$1
flag=$2

change_bar_style () {
  if [ $flag -eq 1 ]; then
    if [ -f $stylesheet ]; then
      cp $HOME/.config/ags/bar/styles/$style $stylesheet
    else
      cp $HOME/.config/ags/bar/styles/$style $stylesheet
    fi
  elif [ -f $stylesheet_w ]; then
    cp $HOME/.config/waybar/styles/$style $stylesheet_w
  else
    cp $HOME/.config/waybar/styles/$style $stylesheet_w
  fi
}

change_swaync_style () {
  if [ -f $stylesheet_nc ]; then
    if [ -f $HOME/.config/swaync/themes/$style ]; then
      cp $HOME/.config/swaync/themes/$style $stylesheet_nc
    else
      cp $HOME/.config/swaync/themes/default.css $stylesheet_nc
    fi
    killall swaync
  fi
}

change_system_style () {
  if [ $style == "future.css" ]; then
    gsettings set org.gnome.desktop.interface gtk-theme $future_theme
  else
    gsettings set org.gnome.desktop.interface gtk-theme $default_theme
  fi
}

change_bar_style
change_system_style
change_swaync_style
exit 0
