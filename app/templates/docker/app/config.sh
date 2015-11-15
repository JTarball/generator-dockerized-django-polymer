#!/bin/bash
set -e

globalTests+=(
	gmt
	postgres
	python
	django
)

testAlias+=(

)

imageTests+=(

)

globalExcludeTests+=(
	[docker-base_utc]=1
)
