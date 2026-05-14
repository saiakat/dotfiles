local json = require("cjson")

local function check_reminders ()
  local file = io.open(os.getenv("HOME") .. "/.config/ags/bar/reminders.json")
  if not file then return nil end
  local content = file:read("*all")
  file:close()

  local today = os.date("%Y-%m-%d")
  local events = json.decode(content)
  for k, v in pairs(events) do
    if k == today then
      local s = ""
      for _, val in ipairs(v) do
        s = s .. "\n" .. val
      end
      os.execute("notify-send 'Reminders for today: " .. s .. "'")
      break
    end
  end
end

check_reminders()
