import { createPoll } from "ags/time";
import { WithTooltip } from "../WithTooltip"
import GLib from "gi://GLib";

export const Clock = () => {
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

