-- hyprland.lua
-- Entry point — sources all sub-modules via require()
-- Each require() runs in its own Lua scope, so an error in one
-- file won't stop the others from loading.

require("env")        -- Environment variables
require("monitors")   -- Monitor layout
require("autostart")  -- Startup applications
require("theme")      -- Look & feel (general, decoration, animations)
require("input")      -- Keyboard, mouse, touchpad, gestures, devices
require("binds")      -- Keybindings
require("rules")      -- Window & workspace rules
