local home = os.getenv("HOME")
return {
  home = home,
  wall_dir_default = home .. '/wallpapers',
  wall_cache_default = home .. '/.cache/walls/wallpapers/wallpapers',
  cache_dir = home .. '/.cache/walls/',
  state_cache_default = home .. '/.cache/walls/wallpapers/state',
  transition_cache_default = home .. '/.cache/walls/wallpapers/transition',
  transition_default = ' --transition-type grow --transition-pos top-right --transition-duration 2 --transition-fps 180',
  state_id = 1,
  start_path = home .. '/.cache/walls/start',
  pid_path = home .. '/.cache/walls/pid',
  wall_dir_cache = home .. '/.cache/walls/wall_dirs',
  current_cache = 'wallpapers',
  active_dir_cache = home .. '/.cache/walls/active',
  current_cache_index = 1,
  wallpaper_dirs = {},
  wallpapers = {},
}
