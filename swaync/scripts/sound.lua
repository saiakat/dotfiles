local handle = io.popen("swaync-client -D")
local res = handle:read("*all")
handle:close()

if res == "false" then
  os.execute("paplay ~/.config/swaync/sounds/" .. arg[1])
end

