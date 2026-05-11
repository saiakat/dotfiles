import { execAsync } from "ags/process";
import { fetchNotifications, NOTIF_ICONS } from "../../fn/fetchNotifications";
import { WithTooltip } from "../WithTooltip"
import { createComputed } from "ags"


export const Notification = () => {
  const notifiTooltipClass = createComputed(fetchNotifications((n) => `tooltip-notification ${n.class}`))
  return (
    <WithTooltip 
      text={fetchNotifications((n) => `${n.text} Notifications`)} 
      className={notifiTooltipClass}
    >
      <button
        class={fetchNotifications((n) => `module notification-module ${n.class}`)}
        onClicked={() =>
          execAsync(["bash", "-c", "swaync-client -t -sw"]).catch(console.error)
        }
      >
      <label
          label={fetchNotifications((n) => NOTIF_ICONS[n.alt] ?? NOTIF_ICONS["none"])}
          halign={3}
        />
      </button>
    </WithTooltip>
  )
}

