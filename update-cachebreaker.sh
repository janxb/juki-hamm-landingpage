#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

function cachebreaker {
	FILE=$DIR/$1
	hash=`md5sum ${FILE} | awk '{ print $1 }'`
	sed -i 's/'$1'?v=.*"/'$1'?v='$hash'"/g' $DIR/$2
	echo "Updated cachebreaker for file $1 : $hash"
}

cachebreaker script.js index.html
cachebreaker style.css index.html