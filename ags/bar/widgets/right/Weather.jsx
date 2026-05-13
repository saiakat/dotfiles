import { createPoll } from "ags/time";
import { WithTooltip } from "../generic"
import { getClass } from "../../fn";

export const Weather = () => {
  const getWeather = createPoll(
    { text: "", tooltip: "", ags: {}},
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

  const cls = getWeather((w) => {
    const temp = Number(w.ags?.temp ?? 0)
    const speed = Number(w.ags?.speed ?? 0)
    const isNormal = temp > 9 && speed < 10
    const isCritical = temp > -5 || speed < 15
    return getClass([isNormal, isCritical, !isNormal && !isCritical])
  })

  const btnClass = cls((c) => `module weather-module ${c}`)
  const tooltipClass = cls((c) => `tooltip-state-${c}`)

  return (
    <WithTooltip
      text={getWeather((w) => w.tooltip)}
      className={tooltipClass}
    >
      <button
        class={btnClass}
      >
        <label label={getWeather((w) => w.text)} />
      </button>
    </WithTooltip>
  )
}

