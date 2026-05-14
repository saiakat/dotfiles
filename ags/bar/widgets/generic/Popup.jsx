import { Astal } from "ags/gtk4";
import Gtk from "gi://Gtk";
import { CornerBrackets, Divider } from "../decorations";
import Gdk from "gi://Gdk";
const display = Gdk.Display.get_default();
const monitor = display.get_monitors().get_item(0)
const monitorWidth = monitor.get_geometry().width;
const monitorHeight = monitor.get_geometry().height;

export const Popup = ({
  windowClass = "custom-window",
  namespace = "",
  children,
  visible,
  setVisible,
  func = () => {},
}) => {
  let width = Math.floor(monitorWidth * 0.1)
  let height = Math.floor(monitorHeight * 0.1)
  if (namespace == "calendar-window") {
    width = Math.floor(monitorWidth * 0.2)
    height = Math.floor(monitorHeight * 0.2)
  }

  const win = (
    <window
      visible={visible}
      class={windowClass}
      namespace={namespace}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.ON_DEMAND}
      anchor={0}
      defaultWidth={width}
      defaultHeight={height}
    >
      <Gtk.Overlay $={(self) => self.add_overlay(CornerBrackets({}))}>
      <box class="popup-box" orientation={Gtk.Orientation.VERTICAL}>
        {children ? children : null}
        <Divider />
        <button
          class="popup-btn"
          onClicked={() => {
            setVisible();
            func();
          }}
          halign={3}
        >
          <label label="close" />
        </button>
      </box>
    </Gtk.Overlay>
    </window>
  );
  return win;
}
