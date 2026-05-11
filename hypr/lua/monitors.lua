-- monitors.lua — Monitor layout, workspace assignments, and monitor scripts

local monitorMain   = "DP-3"
local monitorSecond = "HDMI-A-2"

-- Primary monitor — positioned to the left
hl.monitor({
  output   = monitorMain,
  mode     = "preferred",
  position = "auto-left",
  scale    = "auto",
})

-- Secondary monitor — positioned to the right
hl.monitor({
  output   = monitorSecond,
  mode     = "preferred",
  position = "auto-right",
  scale    = "auto",
})

-- Catch-all fallback for any other connected monitor
hl.monitor({
  output   = "",
  mode     = "preferred",
  position = "auto",
  scale    = "auto",
})

print(hl.get_monitors())
-- Workspace → monitor assignments
hl.workspace_rule({ workspace = "1", monitor = monitorMain })
hl.workspace_rule({ workspace = "2", monitor = monitorMain })
hl.workspace_rule({ workspace = "3", monitor = monitorSecond })
hl.workspace_rule({ workspace = "4", monitor = monitorSecond })

-- Monitor-related startup scripts
hl.on("hyprland.start", function()
  local monitor_table = hl.get_monitors()
  local dp = 'DP'
  local hdmi = 'HDMI'
  local dp_monitors = {}
  local hdmi_monitors = {}
  local monitor_left
  local monitor_right

  for _, v in pairs(monitor_table) do
    local strv = tostring(v)
    local start, _ = string.find(strv, dp)
    if start then
      table.insert(dp_monitors, string.sub(strv, start, #strv - 1))
    else
      start, _ = string.find(strv, hdmi)
      if not start then goto continue end
      table.insert(hdmi_monitors, string.sub(strv, start, #strv - 1))
    end
    ::continue::
  end

  if #dp_monitors >= 1 then
    monitor_left = dp_monitors[1]
    if #dp_monitors >= 2 then
      monitor_right = dp_monitors[2]
    end
  else
    monitor_right = hdmi_monitors[1]
    if #hdmi_monitors >= 2 then
      monitor_right = hdmi_monitors[2]
    end
  end

  if monitor_left then
    hl.monitor({
        output   = monitor_left,
        mode     = "preferred",
        position = "auto-left",
        scale    = "auto",
    })
    hl.workspace_rule({ workspace = "1", monitor = monitor_left })
    hl.workspace_rule({ workspace = "2", monitor = monitor_left })
  end
  if monitor_right then
    hl.monitor({
        output   = monitor_right,
        mode     = "preferred",
        position = "auto-right",
        scale    = "auto",
    })
    hl.workspace_rule({ workspace = "3", monitor = monitor_right })
    hl.workspace_rule({ workspace = "4", monitor = monitor_right })
  end

  if not monitor_left and not monitor_right then
    hl.monitor({
      output   = "",
      mode     = "preferred",
      position = "auto",
      scale    = "auto",
    })
  end
  hl.dsp.focus({ workspace = 1 })

end)
