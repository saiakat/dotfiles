import { createState } from "ags"
import { execAsync } from "ags/process"

export const [updateData, setUpdateData] = createState({ text: "󰅠", tooltip: "All packages up to date" })

export const fetchUpdates = () =>
  execAsync(["bash", "-c", "/usr/bin/checkupdates; exit 0"])
    .then((out) => {
      const lines = out.trim().split("\n").filter(Boolean)
      const count = lines.length
      if (count === 0) setUpdateData({ text: "󰅠", tooltip: "All packages up to date" })
      else if (count === 1) setUpdateData({ text: "󰅢", tooltip: "1 update available" })
      else setUpdateData({ text: "󰅢", tooltip: `${count} updates available` })
    })
    .catch(console.error)

fetchUpdates()
setInterval(fetchUpdates, 3_600_000)
