import Gtk from "gi://Gtk"

export const PipRow = ({ total = 5, active = 0 }) => (
  <Gtk.DrawingArea
    widthRequest={total * 22}
    heightRequest={20}
    canTarget={false}
    $={(self) => {
      self.set_draw_func((_, cr) => {
        for (let i = 0; i < total; i++) {
          const cx = i * 22 + 11;
          const cy = 10;
          const s = 7;

          // diamond shape
          cr.moveTo(cx, cy - s);
          cr.lineTo(cx + s, cy);
          cr.lineTo(cx, cy + s);
          cr.lineTo(cx - s, cy);
          cr.closePath();

          if (i < active) {
            cr.setSourceRGBA(0.635, 0.467, 1, 0.35);
            cr.fillPreserve();
            cr.setSourceRGBA(0.369, 0.769, 0.835, 1);
          } else {
            cr.setSourceRGBA(0.239, 0.204, 0.333, 1);
            cr.fillPreserve();
            cr.setSourceRGBA(0.239, 0.204, 0.333, 1);
          }
          cr.setLineWidth(1.5);
          cr.stroke();

          // connector line
          if (i < total - 1) {
            cr.setSourceRGBA(0.239, 0.204, 0.333, 1);
            cr.setLineWidth(0.8);
            cr.moveTo(cx + s, cy);
            cr.lineTo(cx + 22 - s, cy);
            cr.stroke();
          }
        }
      });
    }}
  />
);
