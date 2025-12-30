#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to kill process on a specific port
kill_port() {
    local port=$1
    local pid=$(lsof -t -i :$port 2>/dev/null)
    if [ -n "$pid" ]; then
        echo -e "${YELLOW}Killing process on port $port (PID: $pid)...${NC}"
        kill -9 $pid 2>/dev/null
        sleep 1
    fi
}

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}E-Shop App Startup Script${NC}"
echo -e "${YELLOW}========================================${NC}"

# Check if Node.js is installed
echo -e "\n${YELLOW}Checking for Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js from https://nodejs.org/${NC}"
    exit 1
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js found: $NODE_VERSION${NC}"
fi

# Check if npm is installed
echo -e "\n${YELLOW}Checking for npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm.${NC}"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm found: $NPM_VERSION${NC}"
fi

# Clean up any existing processes on ports 4000 and 5173
echo -e "\n${YELLOW}Checking for existing processes on ports 4000 and 5173...${NC}"
kill_port 4000
kill_port 5173

# Install server dependencies
echo -e "\n${YELLOW}Installing server dependencies...${NC}"
cd server
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Server dependencies already installed${NC}"
else
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Server dependencies installed successfully${NC}"
    else
        echo -e "${RED}✗ Failed to install server dependencies${NC}"
        exit 1
    fi
fi
cd ..

# Install client dependencies
echo -e "\n${YELLOW}Installing client dependencies...${NC}"
cd client
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Client dependencies already installed${NC}"
else
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Client dependencies installed successfully${NC}"
    else
        echo -e "${RED}✗ Failed to install client dependencies${NC}"
        exit 1
    fi
fi
cd ..

# Start servers
echo -e "\n${YELLOW}========================================${NC}"
echo -e "${YELLOW}Starting servers...${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "${GREEN}Backend server will start on: http://localhost:4000${NC}"
echo -e "${GREEN}Frontend server will start on: http://localhost:5173${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop both servers${NC}\n"

# Start backend server in the background
cd server
npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
cd ..

# Wait for backend to be ready
echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is ready!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ Backend failed to start. Check logs:${NC}"
        cat /tmp/backend.log
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 1
done

# Start frontend server in the foreground
cd client
npm start

# When frontend is terminated, also kill the backend
kill $BACKEND_PID 2>/dev/null
echo -e "\n${YELLOW}Shutting down servers...${NC}"
echo -e "${GREEN}✓ Servers stopped${NC}"
