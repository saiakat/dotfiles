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

function M.execute_arbitrary (fns)
  local err
  for _, fn in ipairs(fns) do
    __, err = fn()
    if err then
      M.pass_err(err)
    end
  end
  return 0, nil
end

function M.help()
  print([[
Usage: walls.sh <command> [options]

Commands:
  n,  next                    Change to the next wallpaper
  pr, prev                    Change to the previous wallpaper
      Options:
        -t, --transition      Use a specific transition effect (see: awww img --help)
        --cache-transition    Cache the given transition for future use
        -r, --restart         Restart from the first wallpaper

  c,  change <path>           Change to a specific wallpaper by path
      Options:
        -t, --transition      Use a specific transition effect
        --cache-transition    Cache the given transition for future use

  s,  slideshow <on|off>      Start or stop the slideshow
      Options:
        sleep <seconds>       Time between wallpapers (default: 60)
        -p, --path <path>     Use a specific wallpaper directory
        -c, --continue        Keep the current position in the wallpaper list
        -r, --restart         Restart from the first wallpaper

  p,  populatecache           Populate the cache from ~/wallpapers
      Options:
        -p, --path <path>     Populate from a specific directory
        -c, --continue        Keep the current position when repopulating

  r,  remove <cache name>     Remove a wallpaper directory cache

  t   <transition effect>     Set the cached transition effect

  u,  update                  Switch to the next wallpaper directory and show its current wallpaper
      Options:
        -d, --directory       Switch to a specific wallpaper directory
        --silent              Switch directory without changing the wallpaper
        --skip-default        Skips the default wallpaper directory (wallpapers)

  h,  help                    Show this help message
]])
end

return M
