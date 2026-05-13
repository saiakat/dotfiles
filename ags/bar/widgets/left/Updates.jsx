import { fetchUpdates } from "../../fn/fetchUpdates";
import { Popup, WithTooltip } from "../generic";
import { execAsync } from "ags/process";
import { createState } from "ags";

export const Updates = () => {
  const [labelText, setLabelText] = createState("");
  const [visible, setVisible] = createState(false);
  const handleVisibilityChange = () => setVisible(!visible())

  const updateData = fetchUpdates(({ text, tooltip }) => ({
    text: text,
    tooltip: tooltip,
  }));

  const updateBox = (
    <>
      <label label="Updates:" class="popup-box-title" halign={3} />
      <label label={labelText} halign={3}/>
      <button 
        class="popup-btn"
        onClicked={() => {
          execAsync(["bash", "-c", "kitty -e yay -Syu"])
            .catch(console.error)
        }}
      > 
        <label label="Install Updates" />
      </button>
    </>
  );

  Popup({ windowClass: "custom-window", namespace: "updates-window", children: updateBox, visible: visible, setVisible: handleVisibilityChange });

  return (
    <WithTooltip text={updateData(u => u.tooltip)}>
      <button
        class="module updates-module"
        onClicked={() => {
          execAsync(["bash", "-c", "checkupdates; exit 0"])
            .then(out => {
              setLabelText(out === "" ? "All packages up to date" : out);
              handleVisibilityChange()
            })
            .catch(console.error)
        }}
      >
        <label label={updateData(u => u.text || "")} halign={3} />
      </button>
    </WithTooltip>
  );
};
