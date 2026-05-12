import { createPoll } from "ags/time"
import { WithTooltip } from "../WithTooltip.jsx"
import Gtk from "gi://Gtk"
import { Popup } from "../generic"

const storage = createPoll(
  { text: "", tooltip: "" },
  30_000,
  ["bash", "-c", "~/.config/waybar/scripts/get-storage.sh"],
  (out) => {
    try {
      return JSON.parse(out)
    } catch {
      return { text: out, tooltip: out }
    };
  },
);

export const Disks = () => {
  const box = (
      <box class="popup-box" orientation={Gtk.Orientation.VERTICAL}>
        <label
          class="disks-title"
          label="Storage"
          halign={3}
        />
        <label
          label={storage((s) => s.text)}
        />
        <button
          class="popup-close"
          onClicked={() => { win.visible = false }}
          halign={3}
        >
          <label label="close" />
        </button>
      </box>
  );

  const win = Popup({ windowClass: "custom-window", namespace: "disks-window", children: box });

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
