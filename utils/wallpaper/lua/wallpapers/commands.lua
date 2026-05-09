local cache = require("cache")
local wallpaper_cmd = require("wallpaper_functions")
local help = require("helpers").help

return {
  c = wallpaper_cmd.change_wall,
  change = wallpaper_cmd.change_wall,
  next = function () return wallpaper_cmd.next_wall('next') end,
  n = function () return wallpaper_cmd.next_wall('next') end,
  prev = function () return wallpaper_cmd.next_wall('prev') end,
  pr = function () return wallpaper_cmd.next_wall('prev') end,
  s = wallpaper_cmd.slide_show,
  slideshow = wallpaper_cmd.slide_show,
  update = wallpaper_cmd.set_updated_cache_wallpaper,
  p = cache.populate_cache,
  populatecache = cache.populate_cache,
  r = cache.delete_cache_entry,
  remove = cache.delete_cache_entry,
  t = cache.change_cached_transition,
  u = wallpaper_cmd.set_updated_cache_wallpaper,
  h = help,
  help = help,
}
