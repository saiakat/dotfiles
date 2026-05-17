import Gtk from "gi://Gtk";

export const ProgressBar = ({ className = "", val }) => (
    <levelbar
        valign={Gtk.Align.CENTER}
        minValue={0}
        maxValue={100}
        value={val}
        mode={Gtk.LevelBarMode.CONTINUOUS}
        class={`progress-bar ${className}`}
    />
)
