import { createPoll } from "ags/time";
import { Popup, WithTooltip } from "../generic"
import GLib from "gi://GLib";
import Gtk from "gi://Gtk"
import { createState } from "gnim";
import { Divider } from "../decorations";

const [visible, setVisible] = createState(false);
const handleVisibilityChange = () => setVisible(!visible());

export const Clock = () => {
  const clock = createPoll("", 1_000, () => {
    const dt = GLib.DateTime.new_now_local()
    return dt.format(" %a %d %H:%M") ?? ""
  })

  const tooltip = createPoll("", 60_000, () => {
    const dt = GLib.DateTime.new_now_local()
    return dt.format("%A %d %Y %B") ?? ""
  })

  const calendar = (
    <>
      <label label="Calendar"></label>
      <Divider />
      <Gtk.Calendar class="custom-calendar"/>
    </>
  )

  Popup({ windowClass: "custom-window", namespace: "calendar-window", children: calendar, visible: visible, setVisible: handleVisibilityChange });

  return (
    <WithTooltip text={tooltip}>
      <button class="module" onClicked={handleVisibilityChange}>
        <label label={clock} />
      </button>
    </WithTooltip>
  )
}

