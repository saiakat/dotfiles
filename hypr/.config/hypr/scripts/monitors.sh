#!/usr/bin/env bash

MONITOR_MAIN="DP-3"
MONITOR_SECOND="HDMI-A-2"

monitors=$(hyprctl monitors | awk '/^Monitor / {print $2}')

has_main=false
has_second=false

echo "$monitors" | grep -q "$MONITOR_MAIN" && has_main=true
echo "$monitors" | grep -q "$MONITOR_SECOND" && has_second=true

if $has_main && $has_second; then
    hyprctl keyword monitor "$MONITOR_MAIN,preferred,auto-left,auto"
    hyprctl keyword monitor "$MONITOR_SECOND,preferred,auto-right,auto"
    hyprctl keyword workspace "1,monitor:$MONITOR_MAIN"
    hyprctl keyword workspace "2,monitor:$MONITOR_MAIN"
    hyprctl keyword workspace "3,monitor:$MONITOR_SECOND"
    hyprctl keyword workspace "4,monitor:$MONITOR_SECOND"

elif $has_main; then
    hyprctl keyword monitor "$MONITOR_MAIN,preferred,auto,auto"
    hyprctl keyword workspace "1,monitor:$MONITOR_MAIN"
    hyprctl keyword workspace "2,monitor:$MONITOR_MAIN"
    hyprctl keyword workspace "3,monitor:$MONITOR_MAIN"
    hyprctl keyword workspace "4,monitor:$MONITOR_MAIN"

elif $has_second; then
    hyprctl keyword monitor "$MONITOR_SECOND,preferred,auto,auto"
    hyprctl keyword workspace "1,monitor:$MONITOR_SECOND"
    hyprctl keyword workspace "2,monitor:$MONITOR_SECOND"
    hyprctl keyword workspace "3,monitor:$MONITOR_SECOND"
    hyprctl keyword workspace "4,monitor:$MONITOR_SECOND"
fi
