-- rules.lua — Window rules

-- Suppress maximize requests from every application
hl.window_rule({
    name           = "suppress-maximize-events",
    match          = { class = ".*" },
    suppress_event = "maximize",
})

-- Ignore unfocused, undecorated XWayland tooltips / phantom windows
hl.window_rule({
    name       = "fix-xwayland-drags",
    match      = {
        class      = "^$",
        title      = "^$",
        xwayland   = true,
        float      = true,
        fullscreen = false,
        pin        = false,
    },
    no_focus = true,
})

-- Discord → workspace 4, silently
hl.window_rule({
    name      = "discord-workspace",
    match     = { class = "discord" },
    workspace = "4 silent",
})

-- Disk Space Info dialog — proportional floating size
hl.window_rule({
    name  = "disk-space-info-float",
    match = { title = "Disk Space Info" },
    size  = { "monitor_w*0.35", "monitor_h*0.25" },
    float = true,
})
