import { Astal } from "ags/gtk4"
import Gtk from "gi://Gtk"
import Gdk from "gi://Gdk"

export const WithTooltip = ({ text, children, className }) => {
  const resolvedClass = typeof className === "function"
  ? className((callback) => `custom-tooltip ${callback}`)
  : `custom-tooltip ${className}`
  const win = (
    <window
      visible={false}
      class={resolvedClass}
      namespace={`tooltip-${Math.random()}`}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
      marginTop={50}
      marginLeft={0}
      layer={Astal.Layer.OVERLAY}
    >
      <box class="tooltip-box">
        <label label={text} wrap={true} halign={3}/>
      </box>
    </window>
  )

  const btn = (
    <box class="tooltip-wrapper">
      <Gtk.EventControllerMotion
        onEnter={() => {
          const alloc = btn.get_allocation()
          // translate widget coords to screen coords
          const [, x, ,] = btn.translate_coordinates(btn.get_root(), 0, 0)

          const display = Gdk.Display.get_default()
          const monitor = display.get_monitor_at_surface(btn.get_root().get_surface())
          const monitorWidth = monitor.get_geometry().width
          
          if (x > monitorWidth / 2) {
            win.anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT
            win.marginRight = monitorWidth - x - alloc.width
          } else {
            win.anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT
            win.marginLeft = x
          }

          win.marginTop = alloc.height - 15
          win.visible = true
        }}
        onLeave={() => {
          win.visible = false
        }}
      />
      {children}
    </box>
  )

  return btn
}
