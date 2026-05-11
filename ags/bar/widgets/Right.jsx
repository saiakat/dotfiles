import { createPoll } from "ags/time";
import { execAsync } from "ags/process";
import { fetchNotifications, NOTIF_ICONS } from "../fn/fetchNotifications";
import { WithTooltip } from "./WithTooltip"
import GLib from "gi://GLib";

// ── Clock ──────────────────────────────────────────────────────────────────
const Clock = () => {
  const clock = createPoll("", 1_000, () => {
    const dt = GLib.DateTime.new_now_local()
    return dt.format(" %a %d %H:%M") ?? ""
  })

  const tooltip = createPoll("", 60_000, () => {
    const dt = GLib.DateTime.new_now_local()
    return dt.format("%A %d %Y %B") ?? ""
  })

  return (
    <WithTooltip text={tooltip}>
      <button class="module">
        <label label={clock} />
      </button>
    </WithTooltip>
  )
}

// ── Weather ────────────────────────────────────────────────────────────────
const Weather = () => {
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
    <WithTooltip text={weather((w) => w.tooltip)}>
      <button
        class="module"
      >
        <label label={weather((w) => w.text)} />
      </button>
    </WithTooltip>
  )
}

// ── Holidays ───────────────────────────────────────────────────────────────
const Holidays = () => {
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
    <WithTooltip text={holidays((h) => h.tooltip)}>
      <button
      class="module"
      visible={holidays((h) => h.text !== "")}
      >
      <label label={holidays((h) => h.text)} />
      </button>
    </WithTooltip>
  )
}

// ── Notification (swaync) ──────────────────────────────────────────────────


const Notification = () => {
  return (
    <WithTooltip 
      text={fetchNotifications((n) => `${n.text} Notifications`)} 
      className="tooltip-notification"
    >
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
    </WithTooltip>
  )
}

// ── Right group ────────────────────────────────────────────────────────────
export const Right = () => {
  return (
    <box class="modules-right" spacing={0} halign={3 /* END */}>
      <Clock />
      <Weather />
      <Holidays />
      <Notification />
    </box>
  )
}
