import { updateData } from "../../fn/fetchUpdates"
import { Popup, WithTooltip } from "../generic"
import { execAsync } from "ags/process"
import { createState } from "ags"

const [labelText, setLabelText] = createState("All packages up to date")
const [visible, setVisible] = createState(false)

const toggleVisible = () => setVisible(!visible())

const checkUpdates = () =>
  execAsync(["bash", "-c", "checkupdates; exit 0"])
    .then((out) => {
      setLabelText(out.trim() === "" ? "All packages up to date" : out.trim())
      toggleVisible()
    })
    .catch(console.error)



export const Updates = () => {
  const updateBox = (
    <>
    <label label="Updates:" class="popup-box-title" halign={3} />
    <label label={labelText} halign={3} />
    <button
    class="popup-btn"
    onClicked={() => execAsync(["bash", "-c", "kitty -e yay -Syu"]).catch(console.error)}
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
