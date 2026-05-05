#!/usr/bin/env bash

path="$HOME/.config/swaync/sounds/discord_sound.mp3"
if [ "$(swaync-client -D)" == "false" ]; then
    paplay path
fi
