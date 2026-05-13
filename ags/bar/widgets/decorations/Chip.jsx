import Gtk from "gi://Gtk"

export const Chip = ({ label: text = "LABEL" }) => (
  <box
    halign={Gtk.Align.START}
  >
    <Gtk.DrawingArea
      halign={Gtk.Align.FILL}
      valign={Gtk.Align.FILL}
      hexpand={true}
      canTarget={false}
      $={(self) => {
        self.set_draw_func((_, cr, w, h) => {
          const skew = 10;

          // skewed outline
          cr.setSourceRGBA(0.369, 0.769, 0.835, 1);
          cr.setLineWidth(1.5);
          cr.moveTo(skew, 0);
          cr.lineTo(w, 0);
          cr.lineTo(w - skew, h);
          cr.lineTo(0, h);
          cr.closePath();
          cr.stroke();

          // violet fill
          cr.setSourceRGBA(0.635, 0.467, 1, 0.08);
          cr.moveTo(skew, 0);
          cr.lineTo(w, 0);
          cr.lineTo(w - skew, h);
          cr.lineTo(0, h);
          cr.closePath();
          cr.fill();

          // end cap dots
          cr.setSourceRGBA(0.369, 0.769, 0.835, 1);
          cr.rectangle(skew - 3, 0, 6, 3);
          cr.fill();
          cr.rectangle(w - skew - 3, h - 3, 6, 3);
          cr.fill();
        });
      }}
    />
    <label
      label={text}
      class="chip-label"
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.CENTER}
    />
  </box>
);
