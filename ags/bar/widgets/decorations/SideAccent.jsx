import Gtk from "gi://Gtk"

export const SideAccent = ({ child }) => (
  <box halign={Gtk.Align.FILL} hexpand={true}>
    <Gtk.DrawingArea
      widthRequest={10}
      valign={Gtk.Align.FILL}
      canTarget={false}
      $={(self) => {
        self.set_draw_func((_, cr, w, h) => {
          // cyan bar
          cr.setSourceRGBA(0.369, 0.769, 0.835, 1);
          cr.rectangle(0, 0, 3, h);
          cr.fill();

          // violet inner line
          cr.setSourceRGBA(0.635, 0.467, 1, 0.5);
          cr.rectangle(5, 8, 1, h - 16);
          cr.fill();

          // top cap
          cr.setSourceRGBA(0.369, 0.769, 0.835, 1);
          cr.rectangle(0, 0, 12, 3);
          cr.fill();

          // bottom cap
          cr.rectangle(0, h - 3, 12, 3);
          cr.fill();

          // mid notch violet
          cr.setSourceRGBA(0.635, 0.467, 1, 0.7);
          cr.rectangle(0, h / 2 - 2, 8, 4);
          cr.fill();
        });
      }}
    />
    <box hexpand={true}>
      {child}
    </box>
  </box>
);
