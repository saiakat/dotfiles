local M = {}
local lfs = require("lfs")

function M.pass_err (msg)
  return 1, msg
end

function M.includes (tab, val)
  for i, v in ipairs(tab) do
    if v == val then
      return true, i
    end
  end
  return false, nil
end

function M.get_value_if_in_table (tab, terms, offset)
  offset = offset or 0
  local res, index
  local tmp = nil
  for _,term in ipairs(terms) do
    res, index = M.includes(tab, term)
    if res then
      if #tab < index + offset then return false, nil end
      tmp = tab[index + offset]
      break
    end
  end
  return tmp
end

function M.file_exists (path)
  local type = lfs.attributes(path, 'mode')
  return type == 'file' or type == 'directory'
end

function M.includes_any (tab, vals)
  for _, v in ipairs(vals) do
    if M.includes(tab, v) then
      return true
    end
  end
  return false
end

function M.write_table_to_file (tab, file)
  for _, v in ipairs(tab) do
    file:write(v .. '\n')
  end
end

function M.help()
  print([[
Usage: lua wallpapers.lua <command> [args]

Commands:
  n|pr, next|prev                                                 Change to the next or previous wallpaper
  --> optional: (-t, --transition <transition effect>)
  c, change <path>                                                Change to a specific wallpaper by path
  s, slideshow <on|off> sleep <time between wallpapers>           Start or stop the slideshow and set timeout in seconds
  --> optional: (-p, --path <path> -c, --continue -r --restart) 
  p, populatecache                                                Populate the cache with wallpapers from ~/wallpapers
  m, makecachefiles                                               Create the cache directory and files if they don't exist
  t -t, --transition <transition effect)                          Change cached transition (awww img --help)
  h, help                                                         Show this help message
]])
end


return M
