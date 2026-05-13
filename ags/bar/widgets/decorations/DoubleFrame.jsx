import Gtk from "gi://Gtk"

export const DoubleFrame = () => (
  <Gtk.DrawingArea
    halign={Gtk.Align.FILL}
    valign={Gtk.Align.FILL}
    hexpand={true}
    vexpand={true}
    canTarget={false}
    $={(self) => {
      self.set_draw_func((_, cr, w, h) => {
        // outer cyan
        cr.setSourceRGBA(0.369, 0.769, 0.835, 1);
        cr.setLineWidth(1.5);
        cr.rectangle(0, 0, w, h);
        cr.stroke();

        // inner violet echo
        cr.setSourceRGBA(0.635, 0.467, 1, 0.45);
        cr.setLineWidth(0.6);
        cr.rectangle(5, 5, w - 10, h - 10);
        cr.stroke();

        // corner caps
        cr.setSourceRGBA(0.369, 0.769, 0.835, 1);
        cr.rectangle(0, 0, 8, 4); cr.fill();
        cr.rectangle(w - 8, 0, 8, 4); cr.fill();
        cr.rectangle(0, h - 4, 8, 4); cr.fill();
        cr.rectangle(w - 8, h - 4, 8, 4); cr.fill();
      });
    }}
  />
);
