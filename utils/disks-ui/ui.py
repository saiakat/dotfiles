import gi
gi.require_version('Gtk', '4.0')
from gi.repository import Gtk, Gdk
import psutil

def get_disk_space():
    partitions = psutil.disk_partitions()
    disk_table = {}
    for partition in partitions:
        try:
            usage = psutil.disk_usage(partition.mountpoint)
            name = f'Mount: {partition.mountpoint}'
            total = f'  Total: {usage.total / (1024**3):.2f} GB'
            used = f'  Used:  {usage.used / (1024**3):.2f} GB'
            free = f'  Free:  {usage.free / (1024**3):.2f} GB'
            percentage = f'  Percent Used: {usage.percent}%'
            disk_table[name] = {
                'total': total,
                'used': used,
                'free': free,
                'percentage': percentage,
            }
        except PermissionError:
            continue
    return disk_table

def on_activate(app):
    css_provider = Gtk.CssProvider()
    css_provider.load_from_data(b"""
        .disk-entry {
            border: 1.5px solid #f2cdcd;
            border-radius: 10px;
            padding: 8px;
        }
        .disk-entry-title {
            font-weight: bold;
            margin-bottom: 4px;
        }
    """)
    Gtk.StyleContext.add_provider_for_display(
        Gdk.Display.get_default(),
        css_provider,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
    )

    win = Gtk.ApplicationWindow(application=app)
    win.set_title('Disk Space Info')
    win.set_default_size(600, 200)

    outer_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=8)

    scroll = Gtk.ScrolledWindow()
    scroll.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.NEVER)
    scroll.set_vexpand(True)

    box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=12)
    box.set_margin_top(16)
    box.set_margin_bottom(16)
    box.set_margin_start(16)
    box.set_margin_end(16)

    disk_table = get_disk_space()

    for mount_name, info in disk_table.items():
        entry_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=4)
        entry_box.add_css_class('disk-entry')

        title = Gtk.Label(label=mount_name)
        title.set_xalign(0)
        title.add_css_class('disk-entry-title')
        entry_box.append(title)

        for key in ('total', 'used', 'free', 'percentage'):
            label = Gtk.Label(label=info[key])
            label.set_xalign(0)
            entry_box.append(label)

        box.append(entry_box)

    scroll.set_child(box)
    outer_box.append(scroll)

    btn = Gtk.Button(label='Close')
    btn.set_margin_top(4)
    btn.set_margin_bottom(12)
    btn.set_margin_start(16)
    btn.set_margin_end(16)
    btn.connect('clicked', lambda _: win.close())
    outer_box.append(btn)

    win.set_child(outer_box)
    win.present()

app = Gtk.Application(application_id='disk-ui')
app.connect('activate', on_activate)
app.run(None)
