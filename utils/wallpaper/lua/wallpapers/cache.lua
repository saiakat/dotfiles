local M = {}

local vars = require("env_variables")
local lfs = require("lfs")
local helpers = require("helpers")

local function load_wallpaper_dirs ()
  vars.wallpaper_dirs = {}
  local file, err = io.open(vars.wall_dir_cache, 'r')
  if not file then
    return helpers.pass_err(err)
  end
  for line in file:lines() do
    if line ~= '' then
      table.insert(vars.wallpaper_dirs, line)
    end
  end
  file:close()
  if #vars.wallpaper_dirs == 0 then
    vars.wallpaper_dirs = {'wallpapers'}
  end
end

function M.get_prev_cache_entry (cache, id)
  local prev_id = id - 1
  if prev_id < 1 then
    prev_id = #cache
  end
  return cache[prev_id]
end

function M.delete_cache_entry ()
  local dir_name = helpers.get_value_if_in_table(arg, {'r', 'remove'}, 1)
  if not dir_name then
    return helpers.pass_err("no directory given to remove")
  end

  local path = vars.cache_dir .. dir_name
  if not os.execute("rm -rf " .. path) then
    return helpers.pass_err("was not able to delete directory: " .. path)
  end

  load_wallpaper_dirs()
  local res, index = helpers.includes(vars.wallpaper_dirs, dir_name)
  if not res then
    return helpers.pass_err(dir_name .. " not found in dir cache (wall_dirs)")
  end
  print('removing: ' .. dir_name)
  table.remove(vars.wallpaper_dirs, index)

  local file, err = io.open(vars.wall_dir_cache, 'w')
  if not file then
    return helpers.pass_err(err)
  end

  helpers.write_table_to_file(vars.wallpaper_dirs, file)
  file:close()
  return 0, nil
end

function M.load_caches ()
  load_wallpaper_dirs()
  local id_file, err= io.open(vars.active_dir_cache, 'r')
  if not id_file then
    return helpers.pass_err(err)
  end
  vars.current_cache_index = math.tointeger(id_file:read('*all')) or 1
  id_file:close()
  vars.current_cache = vars.wallpaper_dirs[vars.current_cache_index]

  return 0, nil
end

local function load_and_update_cached_id ()
  local id_file, err
  id_file, err = io.open(vars.active_dir_cache, 'r')
  if not id_file then
    return helpers.pass_err(err)
  end

  vars.current_cache_index = math.tointeger(id_file:read('*all')) or 1
  id_file:close()
  local next_id = vars.current_cache_index + 1
  if next_id > #vars.wallpaper_dirs then
    next_id = 1
  end

  id_file, err = io.open(vars.active_dir_cache, 'w')
  if not id_file then
    return helpers.pass_err(err)
  end
  id_file:write(tostring(next_id))
  id_file:close()

  return 0, nil
end

function M.update_active ()
  local res, loading_err = M.load_caches()
  if res == 1 then
    return helpers.pass_err(loading_err)
  end
  local dir = helpers.get_value_if_in_table(arg, {'-d', '--directory'}, 1)
  if dir then
    for i, v in ipairs(vars.wallpaper_dirs) do
      if v == dir then
        vars.current_cache = dir
        local file, err = io.open(vars.active_dir_cache, 'w')
        if not file then
          return helpers.pass_err(err)
        end
        vars.current_cache_index = i
        file:write(tostring(i))
        file:close()
      end
    end
  else
    local err
    res, err = load_and_update_cached_id()
    if res == 1 then
      return helpers.pass_err(err)
    end
    vars.current_cache = vars.wallpaper_dirs[vars.current_cache_index]
  end
  return 0, nil
end

local function loop_wall_dirs ()
  local res
  local file, err = io.open(vars.wall_dir_cache, 'r')
  if not file then
    return helpers.pass_err(err)
  end
  local cache_files = {'wallpapers', 'state', 'transition'}
  for line in file:lines() do
    if line == '' then goto continue end
    local current = vars.cache_dir .. line
    if not helpers.file_exists(current) then
      res, err = lfs.mkdir(current)
      if not res then
        return helpers.pass_err('was not able to make cache dir: ' .. err)
      end
    end
    for _, cache_type in ipairs(cache_files) do
      local content = ''
      if cache_type == 'transition' then
        content = vars.transition_default
      end
      local current_cache_file = current .. '/' .. cache_type
      if not helpers.file_exists(current_cache_file) then
        local file2, err2 = io.open(current_cache_file, 'w')
        if not file2 then
          return helpers.pass_err('was not able to make cache file:' ..  err2)
        end
        file2:write(content)
        file2:close()
      end
    end
      ::continue::
  end
  file:close()
  return 0, nil
end

function M.make_cache()
  local res, file, err
  if not helpers.file_exists(vars.home .. '/.cache') then
    return helpers.pass_err('what kind of weird linux are you running???')
  end
  if not helpers.file_exists(vars.cache_dir) then
    res, err = lfs.mkdir(vars.cache_dir)
    if not res then
      return helpers.pass_err('was not able to make cache dir: ' .. err)
    end
  end
  if not helpers.file_exists(vars.wall_dir_cache) then
    file, err = io.open(vars.wall_dir_cache, 'w')
    if not file then
      return helpers.pass_err('was not able to make cache file: ' ..  err)
    end
    file:write('wallpapers\n')
    file:close()
  end
  loop_wall_dirs()
  if not helpers.file_exists(vars.active_dir_cache) then
    file, err = io.open(vars.active_dir_cache, 'w')
    if not file then
      return helpers.pass_err('was not able to make cache file: ' ..  err)
    end
    file:write('1')
    file:close()
  end
  return 0, nil
end

function M.serialize(token)
    if type(token) == "number" then
        return tostring(token)
    elseif type(token) == "string" then
        return token
    elseif type(token) == "table" then
        local s = ""
        for _, v in pairs(token) do
            s = s .. M.serialize(v) .. "\n"
        end
        return s
    else
        return nil
    end
end

function M.populate_cache ()
  local res, err
  res, err = M.make_cache()
  if res == 1 then
    return helpers.pass_err(err)
  end

  local wall_dir = helpers.get_value_if_in_table(arg, {'-p','--path'}, 1)
  wall_dir = wall_dir or vars.wall_dir_default
  local tmp = {}

  for file in lfs.dir(wall_dir) do
    if file == '.' or file == '..' then
      goto continue
    end
    local attr = lfs.attributes(wall_dir .. "/" .. file)
    if attr.mode ~= 'file' then goto continue end
    table.insert(tmp,wall_dir .. '/' .. file)
      ::continue::
  end

  local cache_file, state_file, current_wall_cache, current_state_cache
  if wall_dir == vars.wall_cache_default then
    current_wall_cache = vars.wall_cache_default
    current_state_cache = vars.state_cache_default
  else
    wall_dir = wall_dir:gsub("/$", "")
    local dir_name = wall_dir:match("([^/]+)$")
    current_wall_cache = vars.cache_dir .. dir_name .. '/wallpapers'
    current_state_cache = vars.cache_dir .. dir_name .. '/state'
    local file
    M.load_caches()
    file, err = io.open(vars.wall_dir_cache, 'a')
    if not file then
      return helpers.pass_err('was not able to make cache file: ' ..  err)
    end
    local write_to_cache = true
    for _, v in ipairs(vars.wallpaper_dirs) do
      if dir_name == v then
        write_to_cache = false
      end
    end
    if write_to_cache then
      file:write(dir_name .. '\n')
    end
    file:close()
  end

  M.make_cache()
  cache_file, err = io.open(current_wall_cache, "w")
  if not cache_file then
    print('unable to find cache file')
    return helpers.pass_err(err)
  end
  cache_file:write(M.serialize(tmp))
  cache_file:close()

  if not helpers.includes_any(arg, {"-c", "--continue"}) then
    state_file, err = io.open(current_state_cache, "w")
    if not state_file then
      print('unable to find state file')
      return helpers.pass_err(err)
    end
    state_file:write('1')
    state_file:close()
  end

  print('wrote cache files successfully!')
  return 0, nil
end

function M.get_files ()
  local wall_cache = vars.cache_dir .. vars.current_cache .. '/wallpapers'
  local file = io.open(wall_cache, 'r')
  if not file then
    return helpers.pass_err('Unable to read cache file: ' .. vars.wall_cache_default .. ' .Does it exist?')
  end
  vars.wallpapers = {}
  for line in file:lines() do
    if line ~= '' then
      table.insert(vars.wallpapers, line)
    end
  end
  if #vars.wallpapers == 0 then
    return helpers.pass_err('Cache file exists but is empty')
  end
  return 0, nil
end

function M.change_cached_transition (transition)
  transition = transition or helpers.get_value_if_in_table(arg, {'t'}, 1)
  if not transition then
    transition = vars.transition_default
  end
  local transition_cache = vars.cache_dir .. vars.current_cache .. '/transition'
  transition_cache = transition_cache or vars.transition_cache_default
  local transition_file, err = io.open(transition_cache, 'w')
  if not transition_file then
    return helpers.pass_err(err)
  end
  transition_file:write(transition)
  transition_file:close()
  return 0, nil
end

function M.load_transition ()
  local transition_cache = vars.cache_dir .. vars.current_cache .. '/transition'
  local file, _ = io.open(transition_cache, 'r')
  if not file then return vars.transition_default end
  local content = file:read('*all')
  file:close()
  if content == '' then
    return vars.transition_default
  end
  return content
end

function M.load_state_id ()
  local state_cache = vars.cache_dir .. vars.current_cache .. '/state'
  local state_file, err = io.open(state_cache, 'r')
  if not state_file then
    return helpers.pass_err(err)
  end
  vars.state_id = math.tointeger(state_file:read('*all')) or 1
  state_file:close()
  return 0, nil
end

function M.update_state_id ()
  local state_cache = vars.cache_dir .. vars.current_cache .. '/state'
  local state_file, err = io.open(state_cache, 'w')
  if not state_file then
    return helpers.pass_err(err)
  end
  state_file:write(tostring(vars.state_id))
  state_file:close()
  return 0, nil
end

function M.set_state_id (id)
  vars.state_id = id or 1
end

return M
