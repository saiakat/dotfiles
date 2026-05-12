import { Astal } from "ags/gtk4"

export const Popup = ({ windowClass, namespace, children }) => {
  const win = (
    <window
      visible={false}
      class={windowClass}
      namespace={namespace}
      layer={Astal.Layer.OVERLAY}
      anchor={0}
    >
    {children ? children : null}
    </window>
  );
  return win;
}
