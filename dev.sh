#!/bin/bash

# Function to check if a port is in use
check_port() {
  lsof -i :$1 > /dev/null 2>&1
  return $?
}

# Kill any existing processes on ports 3001 and 5173
if check_port 3001; then
  echo "Port 3001 is in use. Killing process..."
  lsof -ti :3001 | xargs kill -9
fi

if check_port 5173; then
  echo "Port 5173 is in use. Killing process..."
  lsof -ti :5173 | xargs kill -9
fi

# Start the backend server
echo "Starting backend server..."
npm run server &
SERVER_PID=$!

# Wait for the server to start
echo "Waiting for server to start..."
until curl -s http://localhost:3001/api/newsletters > /dev/null; do
  if ! ps -p $SERVER_PID > /dev/null; then
    echo "Server failed to start"
    exit 1
  fi
  sleep 1
done

echo "Server is running"

# Start the frontend development server
echo "Starting frontend..."
npm run dev

# Cleanup on exit
trap 'kill $SERVER_PID' EXIT
