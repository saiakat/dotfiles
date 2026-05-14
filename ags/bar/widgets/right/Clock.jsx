import { createPoll } from "ags/time";
import { readFile, writeFile } from "ags/file";
import { Popup, WithTooltip } from "../generic"
import GLib from "gi://GLib";
import Gtk from "gi://Gtk"
import { createState } from "gnim";
import { Divider } from "../decorations";

const [visible, setVisible] = createState(false);
const [visibleEvent, setVisibleEvent] = createState(false);
const [selectedDate, setSelectedDate] = createState(null);
const handleVisibilityChange = () => setVisible(!visible());
const handleEventVisibility = () => setVisibleEvent(!visibleEvent());

const reminderFile = `./reminders.json`;

const loadEvents = () => {
  try {
    return JSON.parse(readFile(reminderFile) || "{}")
  } catch {
    return {}
  }
}

const get_date = (dateObj) => ({
  day: dateObj.get_day_of_month(),
  month: dateObj.get_month(),
  year: dateObj.get_year(),
})

const tooltip = createPoll("", 60_000, () => {
  const dt = GLib.DateTime.new_now_local()
  return dt.format("%A %d %Y %B") ?? ""
})

const clock = createPoll("", 1_000, () => {
  const dt = GLib.DateTime.new_now_local()
  return dt.format(" %a %d %H:%M") ?? ""
})

export const Clock = () => {
  let inputWidget
  let calendarWidget

  const markEventDays = () => {
    if (!calendarWidget) return
    const { month, year } = get_date(calendarWidget.get_date())

    const events = loadEvents()
    calendarWidget.clear_marks()

    for (let day = 1; day <= 31; day++) {
      const key = `${year}-${month}-${day}`
      if (events[key]?.length) {
        calendarWidget.mark_day(day)
      }
    }
  }

  const saveEvent = () => {
    const date = selectedDate()
    if (!date || !inputWidget) return

    const text = inputWidget.get_text()
    if (!text.trim()) return

    const key = `${date.year}-${date.month}-${date.day}`
    const events = loadEvents()

    events[key] = [...(events[key] || []), text.trim()]
    writeFile(reminderFile, JSON.stringify(events, null, 2))
    inputWidget.set_text("")
    handleEventVisibility()
    markEventDays()
  }

  const handleSelect = (self) => {
    handleEventVisibility()
    const { day, month, year } = get_date(self.get_date())
    setSelectedDate({ day, month, year })
  }

  const inputBox = (
    <box orientation={Gtk.Orientation.VERTICAL}>
      <Gtk.Entry
        $={(self) => { inputWidget = self }}
        placeholderText="Event title..."
        onActivate={() => saveEvent()}
        class="popup-input"
      />
      <button class="popup-btn" onClicked={() => saveEvent()}>
        <label label="Save" />
      </button>
    </box>
  )

  const calendar = (
    <>
      <label label="Calendar" />
      <Divider />
      <Gtk.Calendar
        class="custom-calendar"
        onDaySelected={handleSelect}
        onNotifyMonth={() => markEventDays()}
        onNotifyYear={() => markEventDays()}
        $={(self) => { calendarWidget = self; markEventDays() }}
      />
    </>
  )

  Popup({ windowClass: "custom-window", namespace: "calendar-window", children: calendar, visible: visible, setVisible: handleVisibilityChange })
  Popup({ windowClass: "custom-window", namespace: "event-entry", children: inputBox, visible: visibleEvent, setVisible: handleEventVisibility })

  return (
    <WithTooltip text={tooltip}>
      <button class="module" onClicked={handleVisibilityChange}>
        <label label={clock} />
      </button>
    </WithTooltip>
  )
}
