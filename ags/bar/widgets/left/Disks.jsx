import { createPoll } from "ags/time"
import { Popup, ProgressBar, WithTooltip } from "../generic"
import { createState } from "gnim"

const storage = createPoll(
  { text: "", tooltip: "", rootUsed: "1G", rootMax: "2G" },
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
  const [fill, setFill] = createState(0);
  const [visible, setVisible] = createState(false);
  const handleVisibilityChange = () => setVisible(!visible());

  setFill(storage(s => { 
    const rootUsed = Number(s.rootUsed.slice(0, -1));
    const rootMax = Number(s.rootMax.slice(0, -1));
    console.log(rootUsed, rootMax, s.text, s.tooltip);
    return (rootUsed / rootMax) * 100
  }))

  const labels = (
    <>
      <label
        class="disks-title"
        label="Storage"
        halign={3}
      />
      <ProgressBar val={fill} />
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
