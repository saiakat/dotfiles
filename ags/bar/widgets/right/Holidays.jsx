import { createPoll } from "ags/time";
import { WithTooltip } from "../WithTooltip"


export const Holidays = () => {
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

