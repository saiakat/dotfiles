import Gtk from "gi://Gtk"
import { updateData, setUpdateData, fetchUpdates } from "../../fn/fetchUpdates"
import { Popup, WithTooltip } from "../generic"
import { execAsync } from "ags/process"
import { createState } from "ags"
import { Divider } from "../decorations"

const [labelText, setLabelText] = createState("All packages up to date")
const [visible, setVisible] = createState(false)

const toggleVisible = () => setVisible(!visible())

const checkUpdates = () => {
  setUpdateData({ text: "󰑓", tooltip: "Checking for Updates" });
  fetchUpdates()
    .then(() => {
      setLabelText(updateData().updates)
      toggleVisible()
    })
    .catch(console.error)
}

const installUpdates = () => {
  setUpdateData({ text: "󰇚", tooltip: "downloading updates" });
  execAsync(["bash", "-c", "kitty -e yay -Syu --noconfirm"])
    .then(fetchUpdates)
    .catch(console.error)
}

export const Updates = () => {
  const updateBox = (
    <>
    <label label="Updates:" class="popup-box-title" halign={3} />
    <Divider />
    <Gtk.ScrolledWindow
      vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
      hscrollbarPolicy={Gtk.PolicyType.NEVER}
      vexpand={true}
      minContentHeight={200}
      class="update-scroll"
    >
      <label label={labelText} halign={3} class="update-title" />
    </Gtk.ScrolledWindow>
    <button
    class="popup-btn update-btn-install"
    onClicked={installUpdates}
    >
      <label label="Install Updates" />
    </button>
    </>
  );

  Popup({
    windowClass: "custom-window",
    namespace: "updates-window",
    children: updateBox,
    visible,
    setVisible: toggleVisible,
  })

  return (
    <WithTooltip text={updateData((u) => u.tooltip)}>
      <button class="module updates-module" onClicked={checkUpdates}>
        <label label={updateData((u) => u.text || "")} halign={3} />
      </button>
    </WithTooltip>
  )
}
