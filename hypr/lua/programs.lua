return {
  terminal    = "kitty",
  fileManager = "nautilus",
  menu        = "if pgrep -x 'wofi'; then killall -9 wofi; fi && wofi --show drun",
  ags         = "ags quit && ags run ~/.config/ags/bar/bar.jsx && killall swaync && swaync",
}
