import { execAsync } from "ags/process";
import { fetchNotifications, NOTIF_ICONS } from "../../fn/fetchNotifications";
import { WithTooltip } from "../generic"

export const Notification = () => {
  const notifications = fetchNotifications(({ text, class: cls, alt, tooltip }) => ({
    tooltipClass: `tooltip-notification ${cls}`,
    modClass: `module notification-module ${cls}`,
    icon: NOTIF_ICONS[alt] ?? NOTIF_ICONS["none"],
    text: `${text} Notifications`,
    tooltip: tooltip !== "" ? tooltip : "0 Notifications",
  }));

  return (
    <WithTooltip 
      text={notifications(n => n.tooltip === "" ? "0 Notifications" : n.tooltip)} 
      className={notifications(n => n.tooltipClass)}
    >
      <button
        class={notifications(n => n.modClass)}
        onClicked={() =>
          execAsync(["bash", "-c", "swaync-client -t -sw"]).catch(console.error)
        }
      >
      <label
          label={notifications(n => n.icon)}
          halign={3}
        />
      </button>
    </WithTooltip>
  )
}

