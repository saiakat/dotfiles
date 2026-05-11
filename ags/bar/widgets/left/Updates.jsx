import { fetchUpdates } from "../../fn/fetchUpdates"
import { WithTooltip } from "../WithTooltip"

export const Updates = () => (
  <WithTooltip text={fetchUpdates((u) => u.tooltip)}>
      <button class={"module updates-module"}>
        <label
          label={fetchUpdates((u) => u.text || "")}
          halign={3}
        />
      </button>
    </WithTooltip>
);

