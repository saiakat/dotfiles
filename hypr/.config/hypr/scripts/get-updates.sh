#!/usr/bin/env bash
cache="$HOME/.cache/waybar/updates"
updates=$(checkupdates | wc -l)
echo $updates > $HOME/.cache/waybar/updates
