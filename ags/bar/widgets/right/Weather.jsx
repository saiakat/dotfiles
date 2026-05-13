import { execAsync } from "ags/process";
import { WithTooltip } from "../generic"
import { getClass } from "../../fn";
import { createState } from "ags";

const [weatherData, setWeatherData] = createState({
  text: "",
  tooltip: "",
  cls: getClass([true, false, false]),
})

const fetchWeather = () =>
  execAsync(["bash", "-c", "cat ~/.cache/waybar/weather 2>/dev/null || echo '{}'"])
    .then((out) => {
      try {
        const data = JSON.parse(out)
        const temp = Number(data.ags?.temp ?? 0)
        const speed = Number(data.ags?.speed ?? 0)
        const cls = getClass([
          temp > 9 && speed < 10,
          (temp > -5 || speed < 15) && !(temp > 9 && speed < 10),
          temp <= -5 && speed >= 15,
        ])
        setWeatherData({ text: data.text ?? "", tooltip: data.tooltip ?? "", cls })
      } catch {
        setWeatherData({ text: out.trim(), tooltip: "", cls: getClass([true, false, false]) })
      }
    })
    .catch(console.error)

fetchWeather()
setInterval(fetchWeather, 180_000)

const btnClass = weatherData((w) => `module weather-module ${w.cls}`);
const tooltipClass = weatherData((w) => `tooltip-state-${w.cls}`);

export const Weather = () => {
  return (
    <WithTooltip
      text={weatherData((w) => w.tooltip)}
      className={tooltipClass}
    >
      <button
        class={btnClass}
      >
        <label label={weatherData((w) => w.text)} />
      </button>
    </WithTooltip>
  )
}

