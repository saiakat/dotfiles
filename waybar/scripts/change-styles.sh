#!/usr/bin/env bash

style=$1
if [ -L ~/.config/waybar/style.css ]; then
    rm ~/.config/waybar/style.css
    cp ~/.config/waybar/styles/$style ~/.config/waybar/style.css
else
    cp ~/.config/waybar/styles/$style ~/.config/waybar/style.css
fi
pkill -SIGUSR2 waybar 
