local home = os.getenv("HOME")
package.path = package.path .. ";" .. home .. "/dotfiles/utils/wallpaper/lua/wallpapers/?.lua"

local function main ()
  local commands = require("commands")
  local cmd = commands[arg[1]] or commands.help
  local res, err = cmd()
  if res then
    print('exitcode: ' .. res)
    if err then print('Error: ' .. err) end
    return res, err
  end
  return 0
end

main()
