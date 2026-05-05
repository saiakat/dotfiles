#!/usr/bin/env bash
if [ "$(swaync-client -D)" == "false" ]; then
    paplay ~/.config/swaync/discord_sound.mp3
fi
