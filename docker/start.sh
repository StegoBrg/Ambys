#!/bin/bash

echo "Starting API..."
cd /app/api
dotnet Healthy-API.dll &

echo "Starting Frontend..."
nginx -g "daemon off;" &

echo "Starting Cron Service for Backups..."
cron -f &

echo "All services started!"
wait
