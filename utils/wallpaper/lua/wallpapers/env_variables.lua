local M = {}
M.home = os.getenv("HOME")
M.cache_dir = M.home .. '/.cache/walls/'
M.start_path = M.cache_dir .. 'start'
M.pid_path = M.cache_dir .. 'pid'
M.wall_dir_cache = M.cache_dir .. 'wall_dirs'
M.active_dir_cache = M.cache_dir .. 'active'
M.cache_name_default = 'wallpapers'
M.wall_dir_default = M.home .. '/' .. M.cache_name_default
M.wall_cache_default = M.cache_dir .. 'wallpapers/wallpapers'
M.state_cache_default = M.cache_dir .. 'wallpapers/state'
M.transition_cache_default = M.cache_dir .. 'wallpapers/transition'
M.transition_default = ' --transition-type grow --transition-pos top-right --transition-duration 2 --transition-fps 180'
M.waybar_styles = { default = 'default.css', city = 'city-foam-pine.css', not_city = 'dark-high-contrast.css'}
M.current_cache = M.cache_name_default
M.state_id = 1
M.current_cache_index = 1
M.wallpaper_dirs = {}
M.wallpapers = {}

return M
