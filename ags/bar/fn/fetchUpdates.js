import { createPoll } from "ags/time"

export const fetchUpdates = createPoll(
  { text: "󰅠", tooltip: "All packages up to date" },
  3_600_000,
  ["bash", "-c", "/usr/bin/checkupdates; exit 0"],
  (out) => {
    const lines = out.trim().split("\n").filter(Boolean);
    const count = lines.length;
    if (count === 0) return { text: "󰅠", tooltip: "All packages up to date" };
    if (count === 1) return { text: "󰅢", tooltip: "1 update available" };
    return { text: "󰅢", tooltip: `${count} updates available` };
  },
);
