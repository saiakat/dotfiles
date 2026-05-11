import { createSubprocess } from "ags/process"

export const fetchNotifications = createSubprocess(
  { alt: "none", class: "" },
  "swaync-client -swb",
  (out, prev) => {
    try {
      return JSON.parse(out)
    } catch {
      return prev
    }
  }
);

export const NOTIF_ICONS = {
  "notification": "",
  "none": "",
  "dnd-notification": "",
  "dnd-none": "",
  "inhibited-notification": "",
  "inhibited-none": "",
  "dnd-inhibited-notification": "",
  "dnd-inhibited-none": ""
}
