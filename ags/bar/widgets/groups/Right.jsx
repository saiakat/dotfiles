import { Clock, Weather, Holidays, Notification } from '../right/index'

export const Right = () => {
  return (
    <box class="modules-right" spacing={0} halign={3 /* END */}>
      <Clock />
      <Weather />
      <Holidays />
      <Notification />
    </box>
  )
}
