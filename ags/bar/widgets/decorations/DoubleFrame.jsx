import Gtk from "gi://Gtk"

export const DoubleFrame = () => (
  <Gtk.DrawingArea
    class="double-frame"
    halign={Gtk.Align.FILL}
    valign={Gtk.Align.FILL}
    hexpand={true}
    vexpand={true}
    canTarget={false}
$={(self) => {
      self.set_draw_func((_, cr, w, h) => {
        const ctx = self.get_style_context()
        const color = ctx.get_color()
        cr.setSourceRGBA(color.red, color.green, color.blue, color.alpha)
        cr.setLineWidth(1.5)
        cr.rectangle(0, 0, w, h)
        cr.stroke()

        // inner violet echo
        cr.setSourceRGBA(0.635, 0.467, 1, 0.45);
        cr.setLineWidth(0.6);
        cr.rectangle(5, 5, w - 10, h - 10);
        cr.stroke();

        // corner caps
        cr.setSourceRGBA(color.red, color.green, color.blue, color.alpha)
        cr.rectangle(0, 0, 8, 4); cr.fill();
        cr.rectangle(w - 8, 0, 8, 4); cr.fill();
        cr.rectangle(0, h - 4, 8, 4); cr.fill();
        cr.rectangle(w - 8, h - 4, 8, 4); cr.fill();
      });
    }}
  />
);
