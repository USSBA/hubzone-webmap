#!/bin/bash -e

export AWS_DEFAULT_REGION=us-east-1
export SERVICE_NAME=hubzone-webmap

MISSING_PARAM=0
function check_param() {
  if [ -z "${!1}" ]; then
    echo "FATAL ERROR, CONTAINER WILL EXIT:  missing required Environment Variable '$1'"
    MISSING_PARAM=1
  fi
}

check_param SECRET_KEY_BASE
check_param HUBZONE_MAP_DB_HOST
check_param HUBZONE_MAP_DB_PASSWORD
check_param HUBZONE_API_KEY
check_param HUBZONE_GOOGLE_API_KEY
if [ "$MISSING_PARAM" == "1" ]; then exit 1; fi

exec "$@"
