import { createPoll } from "ags/time"
import { Astal } from "ags/gtk4"
import { WithTooltip } from "../WithTooltip.jsx"
import Gtk from "gi://Gtk"

const storage = createPoll(
  { text: "", tooltip: "" },
  30_000,
  ["bash", "-c", "~/.config/waybar/scripts/get-storage.sh"],
  (out) => {
    try {
      return JSON.parse(out)
    } catch {
      return { text: out, tooltip: out }
    }
  },
);

export const Disks = () => {
  const win = (
    <window
      visible={false}
      class="disks-window"
      namespace="disks-window"
      layer={Astal.Layer.OVERLAY}
      anchor={0}
    >
      <box class="disks-box" orientation={Gtk.Orientation.VERTICAL}>
        <label
          class="disks-title"
          label="Storage"
          halign={3}
        />
        <label
          label={storage((s) => s.text)}
        />
        <button
          class="disks-close"
          onClicked={() => { win.visible = false }}
          halign={3}
        >
          <label label="close" />
        </button>
      </box>
    </window>
  )

  const btn = (
    <button
      class="module disks-module"
      onClicked={() => { win.visible = !win.visible }}
    >
      <label label="" halign={3} />
    </button>
  )

  return (
    <WithTooltip text={storage((s) => s.text)}>
      {btn}
    </WithTooltip>
  )
}
