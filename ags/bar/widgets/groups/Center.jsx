import Hyprland from "gi://AstalHyprland"
import { createBinding, createComputed, For } from "ags"

const WorkspaceButton = ({ ws }) => {
  const hypr = Hyprland.get_default()
  const focused = createBinding(hypr, "focusedWorkspace")

  const isActive = createComputed(() => focused()?.id === ws.id)
  const isUrgent = createComputed(() => {
    return hypr.get_clients().some(
      (c) => c.workspace?.id === ws.id && c.urgent
    )
  })

  const cssClass = createComputed(() => {
    if (isUrgent()) return "workspace-btn urgent"
    if (isActive()) return "workspace-btn active"
    return "workspace-btn"
  })

  return (
    <button
      class={cssClass}
      onClicked={() => ws.focus()}
    >
      <label label={`${ws.id}`} />
    </button>
  )
}

export const Center = () => {
  const hypr = Hyprland.get_default()
  const workspaces = createBinding(hypr, "workspaces")
  const noMagic = createComputed(() => 
    workspaces().filter((ws) => ws.id > 0)
  )

  // Sort workspaces by id
  const sorted = createComputed(() =>
    noMagic().sort((a, b) => a.id - b.id)
  )

  return (
    <box class="workspaces-container">
      <For each={sorted}>
        {(ws) => <WorkspaceButton ws={ws} />}
      </For>
    </box>
  )
}
