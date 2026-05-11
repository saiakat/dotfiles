import Gtk from "gi://Gtk"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"
import { WithTooltip } from "../WithTooltip.jsx"

const volIcons = ["", "", " "]
const vol = createPoll("", 500, ["bash", "-c",
  `wpctl get-volume @DEFAULT_AUDIO_SINK@ 2>/dev/null | awk '{print $2, ($3=="[MUTED]" ? "muted" : "")}'`
])

const label = vol((out) => {
  const parts = out.trim().split(" ")
  const pct = Math.round(parseFloat(parts[0] ?? "0") * 100)
  const muted = parts[1] === "muted"
  if (muted) return ""
  const icon = pct === 0 ? volIcons[0] : pct < 50 ? volIcons[1] : volIcons[2]
  return `${icon} ${pct}%`
})

export const Volume = () => {

  return (
    <WithTooltip text="Click to open pavucontrol">
      <button
        class="module volume-module"
        onClicked={() => execAsync("pavucontrol").catch(console.error)}
      >
        <Gtk.EventControllerScroll
          flags={Gtk.EventControllerScrollFlags.VERTICAL}
          onScroll={(self, dx, dy) => {
            const direction = dy > 0 ? "-5%" : "+5%"
            execAsync(["bash", "-c", `wpctl set-volume @DEFAULT_AUDIO_SINK@ ${direction} --limit 1.0`])
              .catch(console.error)
          }}
        />
        <label label={label} />
      </button>
    </WithTooltip>
  )
}
