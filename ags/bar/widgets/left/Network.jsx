import { createPoll } from "ags/time"
import { WithTooltip } from "../generic"

export const Network = () => {
  // Use astal-network if available; fall back to a simple poll
  const net = createPoll("", 5_000, ["bash", "-c",
    `ip route get 1.1.1.1 2>/dev/null && echo 'eth' || echo 'disconnected'`
  ], (out) => out.trim())

  const label = net((state) =>
    state === "disconnected"
      ? " Disconnected"
      : "" // ethernet nerd-font glyph
  )

  const tooltip = createPoll("", 5_000, ["bash", "-c",
    `ip addr show $(ip route | grep default | awk '{print $5}' | head -1) 2>/dev/null | grep 'inet ' | awk '{print $2}' || echo 'No connection'`
  ])

  return (
  <WithTooltip text={tooltip}>
    <button class={"module network-module"}>
      <label label={label} halign={3} />
    </button>
  </WithTooltip>
  );
};

