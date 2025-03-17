#!/usr/bin/env bash
host="$1"
shift
cmd="$@"

until nc -z $host; do
  echo "Waiting for $host..."
  sleep 2
done

exec $cmd
