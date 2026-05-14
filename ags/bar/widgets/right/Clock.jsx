import { createPoll } from "ags/time";
import { readFile, writeFile } from "ags/file";
import { Popup, WithTooltip } from "../generic"
import GLib from "gi://GLib";
import Gtk from "gi://Gtk"
import { createState } from "gnim";
import { Divider } from "../decorations";

const [visible, setVisible] = createState(false);
const [visibleEvent, setVisibleEvent] = createState(false);
const [visibleLabel, setVisibleLabel] = createState(false);
const [selectedDate, setSelectedDate] = createState(null);
const [labelText, setLabel] = createState("");
const handleVisibilityChange = ({setter, visibility}) => ( function () {setter(!visibility())});

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

const normalizeDate = ({ day, month }) => {
  let normalizedDay, normalizedMonth = undefined
  if (day) {
    normalizedDay = day < 10 ? `0${day}` : day
  }
  if (month) {
    normalizedMonth = month < 10 ? `0${month}` : month
  }
  return { day: normalizedDay, month: normalizedMonth }
}

export const Clock = () => {
  let inputWidget
  let calendarWidget

  const hasEvent = day => loadEvents()[day] ? true : false;

  const markEventDays = () => {
    if (!calendarWidget) return
    const { month, year } = get_date(calendarWidget.get_date())

    const events = loadEvents()
    calendarWidget.clear_marks()

    for (let day = 1; day <= 31; day++) {
      const { month: normalMonth, day: normalDay } = normalizeDate({ day, month })
      const key = `${year}-${normalMonth}-${normalDay}`
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

    const { day, month } = normalizeDate({ day: date.day, month: date.month });
    const key = `${date.year}-${month}-${day}`
    const events = loadEvents()

    events[key] = [...(events[key] || []), text.trim()]
    writeFile(reminderFile, JSON.stringify(events, null, 2))
    inputWidget.set_text("")
    handleVisibilityChange({setter: setVisibleEvent, visibility: visibleEvent})();
    markEventDays()
  }

  const handleSelect = () => {
    const { day, month, year } = get_date(calendarWidget.get_date())
    setSelectedDate({ day, month, year })
    const { day: normalDay, month: normalMonth } = normalizeDate({ day, month })

    const date = `${year}-${normalMonth}-${normalDay}`
    if (!hasEvent(date)) {
      handleVisibilityChange({setter: setVisibleEvent, visibility: visibleEvent})();
      return;
    };
    setLabel(loadEvents()[date].join('\n'));
    handleVisibilityChange({ setter: setVisibleLabel, visibility: visibleLabel })();
   };

  const eventLabel = (
    <>
      <label label={labelText} />
      <button class="popup-btn" onClicked={() => {
        setVisibleLabel(false)
        setVisibleEvent(true)
      }}>
        <label label="Add Event" />
      </button>
    </>
  )

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

  Popup({ windowClass: "custom-window", namespace: "calendar-window", children: calendar, visible: visible, setVisible: handleVisibilityChange({ setter: setVisible, visibility: visible }) })
  Popup({ windowClass: "custom-window", namespace: "event-input", children: inputBox, visible: visibleEvent, setVisible: handleVisibilityChange({ setter: setVisibleEvent, visibility: visibleEvent }) })
  Popup({ 
    windowClass: "custom-window",
    namespace: "event-entry",
    children: eventLabel,
    visible: visibleLabel,
    setVisible: handleVisibilityChange({ setter: setVisibleLabel, visibility: visibleLabel }),
  })

  return (
    <WithTooltip text={tooltip}>
      <button class="module" onClicked={handleVisibilityChange({ setter: setVisible, visibility: visible })}>
        <label label={clock} />
      </button>
    </WithTooltip>
  )
}
