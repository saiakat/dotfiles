-- hyprland.lua — Main entry point
-- Hyprland 0.55+ Lua configuration
-- Each module is a separate scope: errors in one won't break the others.

require("lua.programs")   -- variable definitions (terminal, menu, etc.)
require("lua.env")        -- environment variables
require("lua.monitors")   -- monitor layout & workspace assignments
require("lua.looknfeel")  -- general, decoration, animations
require("lua.layouts")    -- dwindle / master layout settings
require("lua.misc")       -- misc settings
require("lua.input")      -- keyboard, mouse, touchpad, gestures
require("lua.autostart")  -- exec-once commands
require("lua.rules")      -- window rules
require("lua.keybinds")   -- keybindings (loaded last so programs vars are set)
require("lua.event-listeners")
