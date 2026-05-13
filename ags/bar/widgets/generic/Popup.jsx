import { Astal } from "ags/gtk4";
import Gtk from "gi://Gtk";
import { CornerBrackets, Divider } from "../decorations";

export const Popup = ({
  windowClass,
  namespace,
  children,
  visible,
  setVisible,
}) => {
  const win = (
    <window
      visible={visible}
      class={windowClass}
      namespace={namespace}
      layer={Astal.Layer.OVERLAY}
      anchor={0}
    >
      <Gtk.Overlay $={(self) => self.add_overlay(CornerBrackets({}))}>
      <box class="popup-box" orientation={Gtk.Orientation.VERTICAL}>
        {children ? children : null}
        <Divider />
        <button
          class="popup-btn"
          onClicked={setVisible}
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
