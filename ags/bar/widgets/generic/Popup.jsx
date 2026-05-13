import { Astal } from "ags/gtk4"
import Gtk from "gi://Gtk"

export const Popup = ({ windowClass, namespace, children, visible, setVisible }) => {

  const win = (
    <window
      visible={visible}
      class={windowClass}
      namespace={namespace}
      layer={Astal.Layer.OVERLAY}
      anchor={0}
    >
    <box class="popup-box" orientation={Gtk.Orientation.VERTICAL}>
      {children ? children : null}
      <button
        class="popup-btn"
        onClicked={setVisible}
        halign={3}
      >
        <label label="close" />
      </button>
    </box>
    </window>
  );
  return win;
}
