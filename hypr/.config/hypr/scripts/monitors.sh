#!/usr/bin/env bash

# Wait until at least one monitor is available
until hyprctl monitors | grep -q "^Monitor"; do
    sleep 0.5
done

monitors=$(hyprctl monitors | awk '/^Monitor / {print $2}')
...
monitors=$(hyprctl monitors | awk '/^Monitor / {print $2}')

dp_monitors=$(echo "$monitors" | grep "DP" | sort -t'-' -k2 -n)
hdmi_monitors=$(echo "$monitors" | grep -i "HDMI")

left=""
right=""

dp_count=$(echo "$dp_monitors" | grep -c "DP")
hdmi_count=$(echo "$hdmi_monitors" | grep -c "HDMI")

if [ "$dp_count" -ge 2 ]; then
    left=$(echo "$dp_monitors" | head -n1)
    right=$(echo "$dp_monitors" | tail -n1)
elif [ "$dp_count" -eq 1 ] && [ "$hdmi_count" -ge 1 ]; then
    left=$(echo "$dp_monitors" | head -n1)
    right=$(echo "$hdmi_monitors" | head -n1)
elif [ "$hdmi_count" -ge 2 ]; then
    left=$(echo "$hdmi_monitors" | head -n1)
    right=$(echo "$hdmi_monitors" | tail -n1)
elif [ "$dp_count" -eq 1 ]; then
    left=$(echo "$dp_monitors" | head -n1)
elif [ "$hdmi_count" -eq 1 ]; then
    left=$(echo "$hdmi_monitors" | head -n1)
fi

if [ -n "$left" ] && [ -n "$right" ]; then
    hyprctl keyword monitor "$left,preferred,auto-left,auto"
    hyprctl keyword monitor "$right,preferred,auto-right,auto"
    hyprctl keyword workspace "1, monitor:$left"
    hyprctl keyword workspace "2, monitor:$left"
    hyprctl keyword workspace "3, monitor:$right"
    hyprctl keyword workspace "4, monitor:$right"
elif [ -n "$left" ]; then
    hyprctl keyword monitor "$left,preferred,auto,auto"
    for i in 1 2 3 4; do
        hyprctl keyword workspace "$i,monitor:$left"
    done
fi
