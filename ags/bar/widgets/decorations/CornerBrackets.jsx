import Gtk from "gi://Gtk"

export const CornerBrackets = ({ size = 20 }) => {
  return (
    <Gtk.DrawingArea
      halign={Gtk.Align.FILL}
      valign={Gtk.Align.FILL}
      hexpand={true}
      vexpand={true}
      canTarget={false}
      $={(self) => {
        self.set_draw_func((_, cr, w, h) => {
          cr.setSourceRGBA(0.369, 0.769, 0.835, 1);
          cr.setLineWidth(2);

          cr.moveTo(0, size); cr.lineTo(0, 0); cr.lineTo(size, 0); cr.stroke();
          cr.moveTo(w - size, 0); cr.lineTo(w, 0); cr.lineTo(w, size); cr.stroke();
          cr.moveTo(0, h - size); cr.lineTo(0, h); cr.lineTo(size, h); cr.stroke();
          cr.moveTo(w - size, h); cr.lineTo(w, h); cr.lineTo(w, h - size); cr.stroke();

          cr.setSourceRGBA(0.635, 0.467, 1, 0.5);
          cr.setLineWidth(0.8);

          cr.moveTo(6, size); cr.lineTo(6, 6); cr.lineTo(size, 6); cr.stroke();
          cr.moveTo(w - size, 6); cr.lineTo(w - 6, 6); cr.lineTo(w - 6, size); cr.stroke();
          cr.moveTo(6, h - size); cr.lineTo(6, h - 6); cr.lineTo(size, h - 6); cr.stroke();
          cr.moveTo(w - size, h - 6); cr.lineTo(w - 6, h - 6); cr.lineTo(w - 6, h - size); cr.stroke();

          cr.setSourceRGBA(0.369, 0.769, 0.835, 1);
          cr.rectangle(0, 0, 4, 4);
          cr.rectangle(w - 4, 0, 4, 4);
          cr.rectangle(0, h - 4, 4, 4);
          cr.rectangle(w - 4, h - 4, 4, 4);
          cr.fill();
        });
      }}
    />
  );
};
