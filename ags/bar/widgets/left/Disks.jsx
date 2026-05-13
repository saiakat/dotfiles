import { createPoll } from "ags/time"
import { Popup, WithTooltip } from "../generic"
import { createState } from "gnim"

const storage = createPoll(
  { text: "", tooltip: "" },
  30_000,
  ["bash", "-c", "~/.config/waybar/scripts/get-storage.sh"],
  (out) => {
    try {
      return JSON.parse(out)
    } catch {
      return { text: out, tooltip: out }
    };
  },
);

export const Disks = () => {
  const [visible, setVisible] = createState(false);
  const handleVisibilityChange = () => setVisible(!visible());

  const labels = (
    <>
      <label
        class="disks-title"
        label="Storage"
        halign={3}
      />
      <label
        label={storage((s) => s.text)}
      />
    </>
  );

  Popup({ windowClass: "custom-window", namespace: "disks-window", children: labels, visible: visible, setVisible: handleVisibilityChange });

  const btn = (
    <button
      class="module disks-module"
      onClicked={handleVisibilityChange}
    >
      <label label="" halign={3} />
    </button>
  )

  return (
    <WithTooltip text={storage((s) => s.text)}>
      {btn}
    </WithTooltip>
  )
}
