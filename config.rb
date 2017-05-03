###
# Extensions
###

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload, :ignore => ['amp', 'fbia']
end

# Put pages in their own directories, so you end up with URLs
# like `/lorem-ipsum` instead of `/lorem-ipsum.html`
activate :directory_indexes

# Google Drive integration
#
# Load a single spreadsheet
# activate :google_drive,
#          :load_sheets => 'my_key'
#
# Load multiple google spreadsheets
# activate :google_drive, load_sheets: ***REMOVED***
#     :spreadsheet => 'my_key'
# ***REMOVED***

# Chorus integration
#
# Activate the chorus extension to use the `chorus` object
activate :chorus
#
# If you're deploying to chorus but not using the API, you
# still must activate it:
# activate :chorus
#
# Load content from chorus with an entry slug or id
# activate :chorus, load_entries: ***REMOVED***
#     :story => 'my-story-slug'
# ***REMOVED***

###
# Page options, layouts, settings
###

set :vertical, 'vox'
set :domain, 'www.vox.com'

# Theme: dark or light
set :theme, 'dark'

# Project title (required)
set :title, 'Healthcare dashboard'

# Default prefill tweet text for tweet buttons
# set :tweet_text, data.microcopy['tweet_text']
# set :tweet_text, 'Checkout out this cool story I found!'

# Default text to use in pinterest shares, uncomment to enable pinterest button
# set :pinterest_text, data.microcopy['pinterest_text']
# set :pinterest_text, 'Such a pretty picture'

# Optional fallback page publish date. Publish date from chorus used by default.
# set :publish_date, data.microcopy['publish_date']
# set :publish_date, 'September 16, 2016 12:00 pm'

# Optional fallback page authors. Author from chorus used by default.
# set :authors, data.microcopy['authors']
# set :authors, 'Bobby Tables, Samantha Sandwich'

# Optional fallback description for page metadata. Only used if the fields
# in the Chorus entry are all blank.
# set :meta_description, data.microcopy['meta_description']
# set :meta_description, 'Everything you wanted to know about sloths'

# Optional fallback image used in meta tags. Only used if the fields
# in the Chorus entry are all blank.
# set :sharing_image, data.microcopy['social_image']
# set :sharing_image, 'http://www.fillmurray.com/1200/630'
# Disable responsive headers; mobile devices render site at 1024px wide
# and enable pan and zoom.
# set :not_responsive, true

# Tell web crawlers to ignore this page
# set :no_index, true

# Display stb in the navbar
# set :show_stb, true

# Put text before the stb
# set :stb_text, 'Sponsored by'

# Enable AMP support
#set :enable_amp, true

###
# Proxies and sitemap
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Automatically build a sitemap from Chorus
# Automatically build a sitemap from the spreadsheet, NOT RECOMMENDED
# build_sitemap_with data.pages

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => ***REMOVED***
#  :which_fake_page => "Rendering a fake page with a local variable" ***REMOVED***

###
# Helpers
###

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

###
# Build-specific configuration
###
configure :build do
  # Stuff in this block only applies when the project is built (middleman build)
  # Add unique IDs to asset filenames. You want this. Disabling it
  # may fix a problem, but it will cause problems for your users
  # that you may not see.
  activate :asset_hash

  # Package and compress all our javascripts and styles
  activate :minify_javascript
  activate :minify_css
end
