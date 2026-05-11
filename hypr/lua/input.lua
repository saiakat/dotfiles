-- input.lua — Keyboard, mouse, touchpad, gestures, and per-device config

hl.config({
    input = {
        kb_layout  = "us",
        kb_variant = "",
        kb_model   = "",
        kb_options = "",
        -- kb_options = "grp:alt_shift_toggle",  -- uncomment to toggle layout
        kb_rules   = "",

        follow_mouse = 1,
        sensitivity  = 0.1,
        force_no_accel = true,

        touchpad = {
            natural_scroll = false,
        },
    },
})

-- 3-finger horizontal swipe → switch workspace
hl.gesture({
    fingers   = 3,
    direction = "horizontal",
    action    = "workspace",
})

-- Per-device overrides
hl.device({
    name        = "epic-mouse-v1",
    sensitivity = -0.5,
})
