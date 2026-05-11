import { createPoll } from "ags/time";
import { execAsync } from "ags/process";
import { fetchNotifications, NOTIF_ICONS } from "../fn/fetchNotifications";
import GLib from "gi://GLib";

// ── Clock ──────────────────────────────────────────────────────────────────
function Clock() {
  const clock = createPoll("", 1_000, () => {
    const dt = GLib.DateTime.new_now_local()
    return dt.format(" %a %d %H:%M") ?? ""
  })

  const tooltip = createPoll("", 60_000, () => {
    const dt = GLib.DateTime.new_now_local()
    return dt.format("%A %d %Y %B") ?? ""
  })

  return (
    <button class="module" tooltipText={tooltip}>
      <label label={clock} />
    </button>
  )
}

// ── Weather ────────────────────────────────────────────────────────────────
function Weather() {
  const weather = createPoll(
    { text: "", tooltip: "" },
    180_000,
    ["bash", "-c", "cat ~/.cache/waybar/weather 2>/dev/null || echo '{\"text\":\"\",\"tooltip\":\"\"}'"],
    (out) => {
      try {
        return JSON.parse(out)
      } catch {
        return { text: out.trim(), tooltip: "" }
      }
    },
  )

  return (
    <button
      class="module"
      tooltipText={weather((w) => w.tooltip)}
    >
      <label label={weather((w) => w.text)} />
    </button>
  )
}

// ── Holidays ───────────────────────────────────────────────────────────────
function Holidays() {
  const holidays = createPoll(
    { text: "", tooltip: "" },
    86_400_000, // once per day
    ["bash", "-c", "cat ~/.cache/waybar/holidays 2>/dev/null || echo '{\"text\":\"\",\"tooltip\":\"\"}'"],
    (out) => {
      try {
        return JSON.parse(out)
      } catch {
        return { text: out.trim(), tooltip: "" }
      }
    },
  )

  return (
    <button
      class="module"
      tooltipText={holidays((h) => h.tooltip)}
      visible={holidays((h) => h.text !== "")}
    >
      <label label={holidays((h) => h.text)} />
    </button>
  )
}

// ── Notification (swaync) ──────────────────────────────────────────────────


function Notification() {
  return (
    <button
      class={fetchNotifications((n) => `module notification-module ${n.class}`)}
      onClicked={() =>
        execAsync(["bash", "-c", "swaync-client -t -sw"]).catch(console.error)
      }
    >
    <label
        label={fetchNotifications((n) => NOTIF_ICONS[n.alt] ?? NOTIF_ICONS["none"])}
        halign={3}
      />
    </button>
  )
}

// ── Right group ────────────────────────────────────────────────────────────
export function Right() {
  return (
    <box class="modules-right" spacing={0} halign={3 /* END */}>
      <Clock />
      <Weather />
      <Holidays />
      <Notification />
    </box>
  )
}
