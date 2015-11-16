#!/bin/bash

#
# Copy of config.sh from official library + custom tests
# Can't seem to get two config files working
# Will need to update this periodically

set -e

globalTests+=(
	gmt
	django
)

testAlias+=(

)

imageTests+=(
	[app_app_1]='
		python-imports
		python-pip-requests-ssl
		python-sqlite3
	'
)

globalExcludeTests+=(
	# single-binary images
	[app_app_1_utc]=1
)
