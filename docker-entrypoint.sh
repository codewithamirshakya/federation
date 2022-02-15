#!/usr/bin/env sh
OAUTH_PATH="/app/keys"
if [[ ! -v PTV_OAUTH_KEY ]];then
    echo -e "OAUTH KEY DOESNOT EXIST"
    exit 1
fi
 
echo $PTV_OAUTH_KEY | base64 -d > ${OAUTH_PATH}/oauth-public.key
exec "$@"