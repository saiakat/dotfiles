import { createPoll } from "ags/time"
import { execAsync } from "ags/process"
import { fetchUpdates } from "../fn/fetchUpdates"
import { WithTooltip } from "./WithTooltip.jsx"

// ── Disks ──────────────────────────────────────────────────────────────────
const Disks = () => {
  const storage = createPoll(
    { text: "", tooltip: "" },
    30_000,
    ["bash", "-c", "~/.config/waybar/scripts/get-storage.sh"],
    (out) => {
      try {
        return JSON.parse(out)
      } catch {
        return { text: out, tooltip: out }
      }
    },
  );

  return (
    <WithTooltip text={storage((s) => s.text)}>
      <button
        class="module disks-module"
        onClicked={() => {
          execAsync(["bash", "-c", "~/.config/waybar/scripts/disks-ui.sh"]).catch(console.error);
        }}
      >
        <label label="" halign={3} />
      </button>
    </WithTooltip>
  );
};

// ── Network ────────────────────────────────────────────────────────────────
const Network = () => {
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
    <button class="module">
      <label label={label} halign={3} />
    </button>
  </WithTooltip>
  );
};

// ── Updates ────────────────────────────────────────────────────────────────
const Updates = () => (
  <WithTooltip text={fetchUpdates((u) => u.tooltip)}>
      <button class="module">
        <label
          label={fetchUpdates((u) => u.text || "")}
          halign={3}
        />
      </button>
    </WithTooltip>
);

// ── Memory ─────────────────────────────────────────────────────────────────
const Memory = () => {
  const mem = createPoll(
    { percent: 0, used: 0, total: 0 },
    5_000,
    () => execAsync("bash -c 'free -b'")
      .then((out) => {
        const line = out.split("\n")[1].trim().split(/\s+/)
        const total = parseInt(line[1])
        const used = parseInt(line[2])
        const percent = Math.round(used / total * 100)
        const toGib = (b) => (b / 1024 ** 3).toFixed(1)
        return { percent, used: parseFloat(toGib(used)), total: parseFloat(toGib(total)) }
      })
      .catch(() => ({ percent: 0, used: 0, total: 0 }))
  )
    return (
      <WithTooltip text={mem((m) => `used: ${m.used} GiB\ntotal: ${m.total} GiB`)}>
        <button class="module">
          <label label={mem((m) => ` ${m.percent}%`)} />
        </button>
      </WithTooltip>
    )
};

// ── PulseAudio / Volume ────────────────────────────────────────────────────
const Volume = () => {
  const volIcons = ["", "", " "]

  const vol = createPoll("", 500, ["bash", "-c",
    `wpctl get-volume @DEFAULT_AUDIO_SINK@ 2>/dev/null | awk '{print $2, ($3=="[MUTED]" ? "muted" : "")}'`
  ])

  const label = vol((out) => {
    const parts = out.trim().split(" ")
    const pct = Math.round(parseFloat(parts[0] ?? "0") * 100)
    const muted = parts[1] === "muted"
    if (muted) return "" // muted nerd-font glyph
    const icon = pct === 0 ? volIcons[0] : pct < 50 ? volIcons[1] : volIcons[2]
    return `${icon} ${pct}%`
  })

  return (
    <WithTooltip text="Click to open pavucontrol">
      <button
        class="module volume-module"
        onClicked={() => execAsync("pavucontrol").catch(console.error)}
      >
        <label label={label} />
      </button>
    </WithTooltip>
  )
}

// ── Left group ─────────────────────────────────────────────────────────────
export const Left = () => {
  return (
    <box class="modules-left" spacing={0}>
      <Disks />
      <Network />
      <Updates />
      <Memory />
      <Volume />
    </box>
  )
}
