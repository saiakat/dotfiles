import { createState } from "ags"
import { execAsync } from "ags/process"

export const [updateData, setUpdateData] = createState({ text: "󰅠", tooltip: "All packages up to date" })

export const fetchUpdates = () =>
  execAsync(["bash", "-c", "/usr/bin/checkupdates; exit 0"])
    .then((out) => {
      const lines = out.trim().split("\n").filter(Boolean)
      const count = lines.length
      const updates = out.trim()

      if (count === 0) setUpdateData({ text: "󰅠", tooltip: "All packages up to date", updates: "All packages up do date" })
      else if (count === 1) setUpdateData({ text: "󰅢", tooltip: "1 update available", updates: `${updates}` })
      else setUpdateData({ text: "󰅢", tooltip: `${count} updates available`, updates:`${updates}` })
      return 0
    })
    .catch(console.error)

fetchUpdates()
setInterval(fetchUpdates, 3_600_000)
