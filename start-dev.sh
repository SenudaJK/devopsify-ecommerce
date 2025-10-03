#!/bin/bash

# DevOpsify E-Commerce Application Startup Script
echo "🚀 Starting DevOpsify E-Commerce Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd src/backend
if ! npm install; then
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

# Build backend
echo -e "${YELLOW}Building backend...${NC}"
if ! npm run build; then
    echo -e "${RED}❌ Failed to build backend${NC}"
    exit 1
fi

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd ../frontend
if ! npm install; then
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

cd ../..

echo -e "${GREEN}✅ Dependencies installed successfully${NC}"

# Check ports
if check_port 3000; then
    echo -e "${RED}❌ Port 3000 is already in use. Please stop the service using port 3000.${NC}"
    exit 1
fi

if check_port 5001; then
    echo -e "${RED}❌ Port 5001 is already in use. Please stop the service using port 5001.${NC}"
    exit 1
fi

# Start backend in background
echo -e "${BLUE}🔧 Starting backend API server on port 5001...${NC}"
cd src/backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Check if backend started successfully
if ! check_port 5001; then
    echo -e "${RED}❌ Backend failed to start${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✅ Backend API server started successfully${NC}"

# Start frontend
echo -e "${BLUE}🎨 Starting frontend React application on port 3000...${NC}"
cd ../frontend
npm start &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 10

echo -e "${GREEN}"
echo "🎉 DevOpsify E-Commerce Application Started Successfully!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5001"
echo "📊 Health Check: http://localhost:5001/health"
echo ""
echo "Demo Login Credentials:"
echo "📧 Email: demo@devopsify.com"
echo "🔑 Password: demo123"
echo ""
echo "Press Ctrl+C to stop all services"
echo -e "${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping services...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for processes
wait
