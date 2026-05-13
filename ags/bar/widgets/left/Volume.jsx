import Gtk from "gi://Gtk"
import { execAsync } from "ags/process"
import { createBinding, createComputed } from "gnim"
import { WithTooltip } from "../generic"
import Wp from "gi://AstalWp"

const wp = Wp.get_default()
const defaultSpeaker = wp.audio.default_speaker

const volume = createBinding(defaultSpeaker, "volume")
const muted = createBinding(defaultSpeaker, "mute")

const volIcons = ["", "", " "]

const label = createComputed(() => {
  if (muted()) return ""
  const pct = Math.round(volume() * 100)
  const icon = pct === 0 ? volIcons[0] : pct < 50 ? volIcons[1] : volIcons[2]
  return `${icon} ${pct}%`
})

export const Volume = () => {
  const btn = (
    <button
      class="module volume-module"
      onClicked={() => execAsync("pavucontrol").catch(console.error)}
    >
      <label halign={Gtk.Align.CENTER} label={label} />
    </button>
  )

  const scroll = new Gtk.EventControllerScroll({
    flags: Gtk.EventControllerScrollFlags.VERTICAL,
  })
  scroll.connect("scroll", (_self, _dx, dy) => {
    const direction = dy > 0 ? "5%-" : "5%+"
    execAsync(["bash", "-c", `wpctl set-volume @DEFAULT_AUDIO_SINK@ ${direction} --limit 1.0`])
      .catch(console.error)
  })
  btn.add_controller(scroll)

  return (
    <WithTooltip text="Click to open pavucontrol">
      {btn}
    </WithTooltip>
  )
}
