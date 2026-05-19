#!/bin/bash

echo "==================================================="
echo "Starting ScreenCast without docker-compose..."
echo "==================================================="

# 1. Create a shared network so the frontend can find the backend
docker network inspect screencast-network >/dev/null 2>&1 || docker network create screencast-network

# Stop and remove any old containers
docker stop backend frontend 2>/dev/null
docker rm backend frontend 2>/dev/null

echo "Building Backend..."
docker build -t screencast-backend ./backend

echo "Starting Backend..."
docker run -d --name backend --network screencast-network -p 5000:5000 --env-file ./backend/.env screencast-backend

echo "Building Frontend..."
docker build -t screencast-frontend ./frontend

echo "Starting Frontend..."
docker run -d --name frontend --network screencast-network -p 8080:80 screencast-frontend

echo "==================================================="
echo "✅ Both containers are running and connected!"
echo "Backend Health: http://localhost:5000/api/health"
echo "Frontend App:   http://localhost:8080"
echo "==================================================="
