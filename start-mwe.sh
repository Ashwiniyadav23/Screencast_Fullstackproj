#!/bin/bash

# Stop and remove existing containers if they exist
docker stop backend-mwe frontend-mwe 2>/dev/null
docker rm backend-mwe frontend-mwe 2>/dev/null

echo "====================================="
echo "Building backend image..."
echo "====================================="
docker build -t screencast-backend ./backend

echo "====================================="
echo "Running backend container..."
echo "====================================="
# Assuming MongoDB is remote as per .env
docker run -d --name backend-mwe -p 5000:5000 --env-file ./backend/.env screencast-backend

echo "====================================="
echo "Building frontend image..."
echo "====================================="
docker build -t screencast-frontend ./frontend

echo "====================================="
echo "Running frontend container..."
echo "====================================="
# Mapping to port 8080 to avoid conflicts with other services
docker run -d --name frontend-mwe -p 8080:80 screencast-frontend

echo "====================================="
echo "✅ MWE is running!"
echo "Backend: http://localhost:5000/api/health"
echo "Frontend: http://localhost:8080"
echo "====================================="
