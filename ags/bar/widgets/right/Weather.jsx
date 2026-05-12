import { createPoll } from "ags/time";
import { WithTooltip } from "../WithTooltip"
import { createComputed } from "ags"

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

  const classes = { 
    normal: 'weather-normal',
    critical: 'weather-critical',
    danger: 'weather-danger',
  };

  const getClass = getWeather((w) => {
    const temp = Number(w.ags.temp)
    const speed = Number(w.ags.speed)
    if (temp > 9 && speed < 10) return classes.normal;
    if (temp > -5 || speed < 15) return classes.critical;
    return classes.danger
  });

  const btnClass =  createComputed(() => `module ${getClass()}`)

  return (
    <WithTooltip
      text={getWeather((w) => w.tooltip)}
      className={getClass}
    >
      <button
        class={btnClass}
      >
        <label label={getWeather((w) => w.text)} />
      </button>
    </WithTooltip>
  )
}

