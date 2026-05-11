local cache = require("cache")
local helpers = require("helpers")
local vars = require("env_variables")

local M = {}

function M.change_wall (file)
  file = file or helpers.get_value_if_in_table(arg, {'c', 'change'}, 1)
  local transition = helpers.get_value_if_in_table(arg, {'-t', '--transition'}, 1)
  if helpers.includes(arg, '--cache-transition') then
    cache.change_cached_transition(transition)
  end

  local transition_args = transition or cache.load_transition()
  local success, exitcode = os.execute('awww img ' .. file .. transition_args)
  if not success then return
    helpers.pass_err('Failed to change Wallpaper to: ' .. file .. 'got: ' .. exitcode)
  end
  print('Changed Wallpaper to: ' .. file)
  return 0, nil
end

local function get_style (key)
  return vars.waybar_styles[key] or vars.waybar_styles['default']
end

local function is_style_same (style1, style2)
  return style1 == style2
end

local function change_styles ()
  local ags_flag = 0
  if helpers.includes(arg, '--ags') then
    ags_flag = 1
  end

  local style = get_style(vars.current_cache)
  local prev_cache = cache.get_prev_cache_entry(vars.wallpaper_dirs, vars.current_cache_index)
  local prev_style = get_style(prev_cache)

  if is_style_same(style, prev_style) then
    return
  end
  print('~/.config/waybar/scripts/change-styles.sh ' .. style .. " " .. ags_flag)
  if not os.execute('~/.config/waybar/scripts/change-styles.sh ' .. style .. " " .. ags_flag) then
    os.execute('~/.config/waybar/scripts/change_styles.sh default.css ' .. ags_flag)
  end
end

function M.next_wall (direction)
  direction = direction or helpers.get_value_if_in_table(arg, {'next', 'n', 'prev', 'pr'}, 0)
  local res, err

  res, err = cache.load_caches()
  if res == 1 then
    return helpers.pass_err(err)
  end

  if helpers.includes_any(arg, {'-r', '--restart'}) then
    cache.set_state_id()
    res, err = cache.update_state_id()
    if res == 1 then
      return helpers.pass_err(err)
    end
  end

  res, err = cache.get_files()
  if res == 1 then
    return helpers.pass_err(err)
  end

  res, err = cache.load_state_id()
  if res == 1 then
    return helpers.pass_err(err)
  end

  local mod = 1
  if (direction == 'prev') or (direction == 'pr') then mod = -1 end

  local next_id = vars.state_id + mod
  if next_id < 1 then
    next_id = #vars.wallpapers
  elseif next_id > #vars.wallpapers then
    next_id = 1
  end


  res, err = M.change_wall(vars.wallpapers[next_id])
  cache.set_state_id(next_id)
  res, err = cache.update_state_id()
  if res == 1 then
    return helpers.pass_err(err)
  end
  return res, err
end

function M.kill_pid_if_exists ()
  local pid_file = io.open(vars.pid_path, 'r')
  if pid_file then
    local pid = pid_file:read('*all')
    pid_file:close()
    os.execute('kill ' .. pid)
    os.remove(vars.pid_path)
  end
end

local slide_show_cmd = {
  on = function ()
    local res, err

    if helpers.file_exists(vars.start_path) then
      if helpers.includes_any(arg, {'-r', '--restart'}) then
        cache.set_state_id()
        res, err = cache.update_state_id()
      elseif helpers.includes_any(arg, {'-p', '--path'}) then
        res, err = cache.populate_cache()
      end
      if res == 1 then
        return helpers.pass_err(err)
      end
      return 0, nil
    end

    os.execute("ps aux | grep 'wallpapers.lua' | grep -v grep | awk '{print $2}' > ~/.cache/walls/pid")
    local start_file, timeout
    timeout = helpers.get_value_if_in_table(arg, {'sleep'}, 1)
    timeout = timeout or 60

    cache.populate_cache()

    start_file, err = io.open(vars.start_path, 'w')
    if not start_file then
      return helpers.pass_err(err)
    end
    start_file:write('=== slide show running ===')
    start_file:close()

    while helpers.file_exists(vars.start_path) do
      res, err = cache.get_files()
      if res == 1 then
        return helpers.pass_err(err)
      end
      res, err = M.next_wall('next')
      if res == 1 then
        return helpers.pass_err('slide_show: ' .. err)
      end
      os.execute('sleep ' .. timeout)
    end
    return 0, nil
  end,

  off = function ()
    M.kill_pid_if_exists()
    local res, err = os.remove(vars.start_path)
    if res then
      print('stopped slide show')
      return 0, nil
    end
    print('unable to stop slide show: ', err)
    return helpers.pass_err(err)
  end
}

function M.slide_show()
  cache.load_caches()
  local command = helpers.get_value_if_in_table(arg, {'on','off'}, 0)
  if not command then
    return helpers.pass_err("Error: Pattern for slideshow: walls.sh s/slideshow <on|off> optional: (sleep <timeout> path <path>)")
  end
  local slide_cmd = slide_show_cmd[command]
  return slide_cmd()
end

function M.set_updated_cache_wallpaper ()
  local res, err

  res, err = cache.update_active()
  if res == 1 then
    return helpers.pass_err(err)
  end

  if helpers.includes(arg, '--silent') then
    return 0, nil
  end

  res, err = cache.load_caches()
  if res == 1 then
    return helpers.pass_err(err)
  end

  if helpers.includes(arg, '--skip-default') and vars.current_cache == vars.cache_name_default then
    res, err = helpers.execute_arbitrary({cache.update_active, cache.load_caches})
    if res == 1 then
      helpers.pass_err(err)
    end
  end

  change_styles()

  res, err = cache.get_files()
  if res == 1 then
    return helpers.pass_err(err)
  end

  res, err = cache.load_state_id()
  if res == 1 then
    return helpers.pass_err(err)
  end

  res, err = M.change_wall(vars.wallpapers[vars.state_id])
  if res == 1 then
    return helpers.pass_err(err)
  end
  return 0, nil
end

return M
