import { execAsync } from "ags/process"
import { WithTooltip } from "../generic"
import { getClass } from "../../fn";
import { createState } from "gnim"

export const Memory = () => {
  const [mem, setMem] = createState({ percent: 0, used: 0, total: 0, cls: getClass([true, false, false]) })

  const fetch = () => execAsync("bash -c 'free -b'")
    .then((out) => {
      const line = out.split("\n")[1].trim().split(/\s+/)
      const total = parseInt(line[1])
      const used = parseInt(line[2])
      const percent = Math.round(used / total * 100)
      const toGib = (b) => (b / 1024 ** 3).toFixed(1)
      const cls = getClass([percent < 50, percent >= 50 && percent < 70, percent >= 70])
      setMem({ percent, used: parseFloat(toGib(used)), total: parseFloat(toGib(total)), cls })
    })
    .catch(console.error)

  fetch()
  setInterval(fetch, 5_000)

  return (
    <WithTooltip
      text={mem((m) => `used: ${m.used} GiB\ntotal: ${m.total} GiB`)}
      className={mem((m) => `tooltip-state-${m.cls}`)}
    >
      <button class={mem((m) => `module module-mem ${m.cls}`)}>
        <label label={mem((m) => ` ${m.percent}%`)} />
      </button>
    </WithTooltip>
  )
}
