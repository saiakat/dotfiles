import { Astal } from "ags/gtk4"
import Gtk from "gi://Gtk"

export function WithTooltip({ text, children }) {
  const win = (
    <window
      visible={false}
      class="custom-tooltip"
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
    <button class="tooltip-wrapper">
      <Gtk.EventControllerMotion
        onEnter={() => {
          const alloc = btn.get_allocation()
          // translate widget coords to screen coords
          const [, x, ,] = btn.translate_coordinates(btn.get_root(), 0, 0)
          win.marginLeft = x
          win.marginTop = alloc.height - 15
          win.visible = true
        }}
        onLeave={() => {
          win.visible = false
        }}
      />
      {children}
    </button>
  )

  return btn
}
