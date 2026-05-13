import Gtk from "gi://Gtk"

export const Divider = () => (
  <Gtk.DrawingArea
    halign={Gtk.Align.FILL}
    hexpand={true}
    heightRequest={16}
    canTarget={false}
    $={(self) => {
      self.set_draw_func((_, cr, w, h) => {
        const mid = h / 2;

        // dim base line
        cr.setSourceRGBA(0.239, 0.204, 0.333, 1);
        cr.setLineWidth(1);
        cr.moveTo(0, mid); cr.lineTo(w, mid);
        cr.stroke();

        // cyan dashed overlay
        cr.setSourceRGBA(0.369, 0.769, 0.835, 0.6);
        cr.setLineWidth(0.5);
        cr.setDash([4, 8], 0);
        cr.moveTo(0, mid); cr.lineTo(w, mid);
        cr.stroke();
        cr.setDash([], 0);

        // left cap
        cr.setSourceRGBA(0.369, 0.769, 0.835, 1);
        cr.rectangle(0, mid - 3, 2, 6);
        cr.fill();

        // right cap
        cr.rectangle(w - 2, mid - 3, 2, 6);
        cr.fill();

        // center diamond (violet)
        cr.setSourceRGBA(0.635, 0.467, 1, 0.7);
        cr.rectangle(w / 2 - 2, mid - 4, 4, 8);
        cr.fill();

        // quarter tick marks
        cr.setSourceRGBA(0.369, 0.769, 0.835, 0.5);
        cr.rectangle(w * 0.25 - 1, mid - 2, 2, 4);
        cr.fill();
        cr.rectangle(w * 0.75 - 1, mid - 2, 2, 4);
        cr.fill();
      });
    }}
  />
);
