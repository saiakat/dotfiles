local programs = require("lua.programs")

hl.on("hyprland.start", function()
  -- Terminal on workspace 1
  hl.exec_cmd("[workspace 1] " .. programs.terminal)

  -- Status bar, wallpaper daemon, notifications, idle management
  hl.exec_cmd("ags run ~/.config/ags/bar/bar.jsx & awww-daemon & swaync & hypridle")

  -- Firefox silently on workspace 3 (secondary monitor)
  hl.exec_cmd("[workspace 3 silent] firefox")

  -- Discord silently on workspace 4 (secondary monitor)
  hl.exec_cmd("[workspace 4 silent] discord")

  hl.exec_cmd(os.getenv("HOME") .. "/.config/hypr/scripts/get-updates.sh")
  hl.exec_cmd(os.getenv("HOME") .. "/.config/hypr/scripts/get-holidays.sh")
  hl.exec_cmd(os.getenv("HOME") .. "/.config/hypr/scripts/weather.sh")
end)
