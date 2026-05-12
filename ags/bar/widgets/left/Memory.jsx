import { createPoll } from "ags/time"
import { execAsync } from "ags/process"
import { WithTooltip } from "../WithTooltip"
import { createComputed } from "ags"
 
export const Memory = () => {
  const mem = createPoll(
    { percent: 0, used: 0, total: 0 },
    5_000,
    () => execAsync("bash -c 'free -b'")
      .then((out) => {
        const line = out.split("\n")[1].trim().split(/\s+/)
        const total = parseInt(line[1])
        const used = parseInt(line[2])
        const percent = Math.round(used / total * 100)
        const toGib = (b) => (b / 1024 ** 3).toFixed(1)
        return { percent, used: parseFloat(toGib(used)), total: parseFloat(toGib(total)) }
      })
      .catch(() => ({ percent: 0, used: 0, total: 0 }))
  )
 
  const memoryStatus = mem((m) => {
    const { percent } = m
    if (percent > 70) return "danger"
    if (percent > 50) return "critical"
    return "success"
  });
 
  const memClass = createComputed(() => `module module-mem ${memoryStatus()}`)
  // Tooltip now uses shared state class: tooltip-state-{success|critical|danger}
  const memTtClass = createComputed(() => `tooltip-state-${memoryStatus()}`)
 
  return (
    <WithTooltip
      text={mem((m) => `used: ${m.used} GiB\ntotal: ${m.total} GiB`)}
      className={memTtClass}
    >
      <button class={memClass}>
        <label label={mem((m) => ` ${m.percent}%`)} />
      </button>
    </WithTooltip>
  )
};
