# usage 
#
# Put a Packmanfile in a folder with packer templates.
#
# Packmanfile.json
# - json snippets object
# - list of templates to build
#   - each with an array of snippet paths to merge
# 
# 
# 
# run packman without options, it will build all. supply a template name and it will build them all
# packman.js <single template name> [everything else gets passed to packer]