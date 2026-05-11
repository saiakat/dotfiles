# AGS Bar

A port of your Waybar config to [AGS](https://aylur.github.io/ags/) (v2, Gtk4/JSX).

## Structure

```
ags-bar/
├── bar.tsx            ← entry point, run with `ags run bar.tsx`
├── style.css          ← all styles (futuristic theme, your exact look)
├── tsconfig.json      ← TypeScript config (for editor support)
└── widgets/
    ├── Left.tsx       ← Disks, Network, Updates, Memory, Volume
    ├── Center.tsx     ← Hyprland workspaces
    └── Right.tsx      ← Clock, Weather, Holidays, Notification (swaync)
```

## Dependencies

| Package | Purpose |
|---|---|
| `ags` | Shell framework |
| `astal-hyprland` | Workspace IPC |
| `astal-wireplumber` | (Optional) better audio control |
| `swaync` | Notification daemon (swaync-client) |
| `pavucontrol` | Volume GUI (opened on volume click) |

## Setup

1. Install AGS v2: https://aylur.github.io/ags/guide/install.html

2. Copy the folder to `~/.config/ags/` (or anywhere):
   ```sh
   cp -r ags-bar ~/.config/ags/
   ```

3. Copy your scripts (keep existing ones):
   ```sh
   # Your scripts are referenced at ~/.config/waybar/scripts/
   # The bar calls them via their existing paths — no changes needed
   ```

4. Copy the SVG border assets to the bar directory if you want the
   `widget-border.svg` / `notification-border.svg` effects
   (currently replaced with CSS borders; add them back as `css` prop
   with a `-gtk-icon-source` if you need the exact SVG corner cuts).

5. Run:
   ```sh
   ags run ~/.config/ags/ags-bar/bar.tsx
   ```

6. For autostart (add to your Hyprland config):
   ```
   exec-once = ags run ~/.config/ags/ags-bar/bar.tsx
   ```

## Theming / Style Switching

Your `scripts/change-styles.sh` pattern can be adapted for AGS by
symlinking or copying `style.css` and sending `app.reset_css()` + 
`app.apply_css()` via `ags request`. The four themes from your
`styles/` folder can each become a separate CSS file imported by
a theme-switching helper.

## Notes

- **Workspaces**: Uses `astal-hyprland` GObject bindings — fully reactive,
  no polling. Workspaces update instantly on IPC events.
- **Volume**: Polls `wpctl` every second. For a reactive version, swap in
  `AstalWp` (astal-wireplumber) bindings.
- **Network**: Polls `ip`. For reactive updates, use `AstalNetwork`.
- **Weather / Updates / Holidays**: Read from the same `~/.cache/waybar/`
  files your existing scripts populate — no changes needed on that side.
- **Disks popup**: Calls your existing `scripts/disks-ui.sh` on click.
- **SVG border-image**: GTK4 supports `border-image` but it works best
  with the `-gtk-scaled` source. The hover expand animation is replicated
  via margin/padding transitions in CSS.
