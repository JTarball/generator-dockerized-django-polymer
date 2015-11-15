#!/bin/bash

#
# Copy of config.sh from official library + custom tests
# Can't seem to get two config files working
# Will need to update this periodically

set -e

globalTests+=(
	gmt
)

testAlias+=(

)

imageTests+=(
	[jtarball/docker-base:latest]='
		python-imports
		python-pip-requests-ssl
		python-sqlite3
	'
)

globalExcludeTests+=(
	# single-binary images
	[jtarball/docker-base:latest_utc]=1
)
