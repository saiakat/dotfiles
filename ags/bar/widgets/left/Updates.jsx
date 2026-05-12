import { fetchUpdates } from "../../fn/fetchUpdates";
import { WithTooltip } from "../WithTooltip";
import { Popup } from "../generic";
import { execAsync } from "ags/process";
import Gtk from "gi://Gtk";
import { createState } from "ags";

export const Updates = () => {
  const [labelText, setLabelText] = createState("");
  const [visible, setVisible] = createState(false);

  const updateData = fetchUpdates(({ text, tooltip }) => ({
    text: text,
    tooltip: tooltip,
  }));

  const updateBox = (
      <box class="popup-box" orientation={Gtk.Orientation.VERTICAL}>
        <label label="Updates:" class="popup-box-title" halign={3} />
        <label label={labelText} halign={3}/>
        <button
          class="popup-close"
          onClicked={() => { win.visible = false }}
          halign={3}
        >
          <label label="close" />
        </button>
      </box>
  );

  const win = Popup({ windowClass: "custom-window", namespace: "updates-window", children: updateBox });

  return (
    <WithTooltip text={updateData(u => u.tooltip)}>
      <button
        class="module updates-module"
        onClicked={() => {
          execAsync(["bash", "-c", "checkupdates; exit 0"])
            .then(out => {
              setLabelText(out === "" ? "All packages up to date" : out);
              win.visible = !win.visible;
            })
            .catch(console.error)
        }}
      >
        <label label={updateData(u => u.text || "")} halign={3} />
      </button>
    </WithTooltip>
  );
};
