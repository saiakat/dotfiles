import { Disks, Volume, Network, Memory, Updates } from "../left/index"

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
