import sys
import psutil
import subprocess
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QHBoxLayout,
    QVBoxLayout, QLabel, QPushButton, QScrollArea
)
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QCursor, QPainter, QColor, QPen
from PyQt6.QtCore import QRectF

def get_disk_space():
    partitions = psutil.disk_partitions()
    disk_table = {}
    for partition in partitions:
        try:
            if partition.mountpoint == "/boot":
                continue
            usage = psutil.disk_usage(partition.mountpoint)
            name = f'Mount: {partition.mountpoint}'
            disk_table[name] = {
                'mountpoint': partition.mountpoint,
                'total': f'Total: {usage.total / (1024**3):.2f} GB',
                'used':  f'Used:  {usage.used  / (1024**3):.2f} GB',
                'free':  f'Free:  {usage.free  / (1024**3):.2f} GB',
                'percentage': f'Percent Used: {usage.percent}%',
            }
        except PermissionError:
            continue
    return disk_table

def open_in_nautilus(mountpoint):
    subprocess.Popen(['nautilus', mountpoint])


class DiskEntry(QWidget):
    BG_NORMAL      = QColor('#2a273f')
    BG_HOVER       = QColor('#181825')
    BORDER_NORMAL  = QColor('#44415a')
    BORDER_HOVER   = QColor('#f2cdcd')
    TEXT_NORMAL    = '#e0def4'
    TEXT_HOVER     = '#e0def4'
    BORDER_WIDTH   = 1.5
    BORDER_RADIUS  = 4.0

    def __init__(self, mount_name, info):
        super().__init__()
        self.mountpoint = info['mountpoint']
        self._hovered = False
        self.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
        self.setAttribute(Qt.WidgetAttribute.WA_Hover)

        layout = QVBoxLayout()
        layout.setSpacing(8)
        layout.setContentsMargins(12, 12, 12, 12)
        self.setLayout(layout)

        self.title = QLabel(mount_name)
        self.title.setObjectName('diskEntryTitle')
        layout.addWidget(self.title)

        self.labels = []
        for key in ('total', 'used', 'free', 'percentage'):
            label = QLabel(info[key])
            label.setObjectName('diskLabel')
            layout.addWidget(label)
            self.labels.append(label)

        self._apply_label_styles(self.TEXT_NORMAL)

    def _apply_label_styles(self, color):
        font = '"JetBrainsMono Nerd Font Mono"'
        base = f'color: {color}; background: transparent; font-family: {font}; border: none; font-size: 15px;'
        self.title.setStyleSheet(base + ' font-weight: 900; padding: 0.1em; border-bottom: 1.5px solid #908caa;')
        for label in self.labels:
            label.setStyleSheet(base + ' font-weight: bold; padding: 0.1em 1em; border-bottom: 1px solid #908caa;')

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        bg     = self.BG_HOVER    if self._hovered else self.BG_NORMAL
        border = self.BORDER_HOVER if self._hovered else self.BORDER_NORMAL

        pen = QPen(border)
        pen.setWidthF(self.BORDER_WIDTH)
        painter.setPen(pen)
        painter.setBrush(bg)

        # Inset rect so border isn't clipped at edges
        half = self.BORDER_WIDTH / 2
        rect = QRectF(self.rect()).adjusted(half, half, -half, -half)
        painter.drawRoundedRect(rect, self.BORDER_RADIUS, self.BORDER_RADIUS)

    def enterEvent(self, event):
        self._hovered = True
        self._apply_label_styles(self.TEXT_HOVER)
        self.update()

    def leaveEvent(self, event):
        self._hovered = False
        self._apply_label_styles(self.TEXT_NORMAL)
        self.update()

    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            open_in_nautilus(self.mountpoint)


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Disk Space Info')
        self.resize(600, 220)
        self.setStyleSheet("""
            QMainWindow, QWidget {
                background: #1e1e2e;
            }
            QPushButton#closeBtn {
                background: #2a273f;
                border: 1.5px solid #f2cdcd;
                border-radius: 4px;
                color: #cba6f7;
                font-family: "JetBrainsMono Nerd Font Mono";
                font-size: 14px;
                padding: 6px 12px;
            }
            QPushButton#closeBtn:hover {
                background: #181825;
                border-color: #f5c2e7;
                color: #f5c2e7;
            }
            QScrollArea, QScrollArea > QWidget > QWidget {
                background: #1e1e2e;
                border: none;
            }
        """)

        central = QWidget()
        self.setCentralWidget(central)

        outer_layout = QVBoxLayout(central)
        outer_layout.setContentsMargins(0, 0, 0, 0)
        outer_layout.setSpacing(8)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setVerticalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAsNeeded)

        scroll_contents = QWidget()
        h_layout = QHBoxLayout(scroll_contents)
        h_layout.setContentsMargins(16, 16, 16, 16)
        h_layout.setSpacing(12)
        for mount_name, info in get_disk_space().items():
            entry = DiskEntry(mount_name, info)
            h_layout.addWidget(entry)

        scroll.setWidget(scroll_contents)
        h_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        outer_layout.addWidget(scroll)

        btn = QPushButton('Close')
        btn.setObjectName('closeBtn')
        btn.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
        btn.setFixedHeight(36)
        btn.clicked.connect(self.close)

        btn_wrapper = QWidget()
        btn_layout = QHBoxLayout(btn_wrapper)
        btn_layout.setContentsMargins(16, 4, 16, 12)
        btn_layout.addWidget(btn)
        outer_layout.addWidget(btn_wrapper)

app = QApplication(sys.argv)
app.setApplicationName("disk-space-info")
window = MainWindow()
window.show()
sys.exit(app.exec())
