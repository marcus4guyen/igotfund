#!/usr/bin/env bash
set -e

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable" && exit 1

echo
echo 'About to call add_project(identifier, title, description, image) on the contract'
echo near call \$CONTRACT add_project '{"identifier":"$1","title":"$2","description":"$3", "imageUrl":"$4"}' --account_id \$OWNER --amount 10
echo
echo \$CONTRACT is $CONTRACT
echo \$1 is [ $1 ] '(the project name)'
echo \$2 is [ $2 ] '(title)'
echo \$3 is [ $3 ] '(description)'
echo \$4 is [ $4 ] '(image)'
echo
near call $CONTRACT add_project '{"identifier":"'"$1"'","title":"'"$2"'","description":"'"$3"'","imageUrl":"'"$4"'"}' --accountId $OWNER --amount 10 --gas=300000000000000