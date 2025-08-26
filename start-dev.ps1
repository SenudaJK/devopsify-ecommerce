# DevOpsify E-Commerce Application Startup Script for Windows
Write-Host "🚀 Starting DevOpsify E-Commerce Application..." -ForegroundColor Blue

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Blue

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location "src\backend"
try {
    npm install
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Build backend
Write-Host "Building backend..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Backend built successfully" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to build backend" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "..\frontend"
try {
    npm install
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Set-Location "..\.."

# Check ports
if (Test-Port 3000) {
    Write-Host "❌ Port 3000 is already in use. Please stop the service using port 3000." -ForegroundColor Red
    exit 1
}

if (Test-Port 5001) {
    Write-Host "❌ Port 5001 is already in use. Please stop the service using port 5001." -ForegroundColor Red
    exit 1
}

# Start backend in background
Write-Host "🔧 Starting backend API server on port 5001..." -ForegroundColor Blue
Set-Location "src\backend"
$backendJob = Start-Job -ScriptBlock { 
    Set-Location $using:pwd
    npm start 
}

# Wait for backend to start
Start-Sleep -Seconds 5

# Check if backend started successfully
if (-not (Test-Port 5001)) {
    Write-Host "❌ Backend failed to start" -ForegroundColor Red
    Stop-Job $backendJob
    Remove-Job $backendJob
    exit 1
}

Write-Host "✅ Backend API server started successfully" -ForegroundColor Green

# Start frontend in background
Write-Host "🎨 Starting frontend React application on port 3000..." -ForegroundColor Blue
Set-Location "..\frontend"
$frontendJob = Start-Job -ScriptBlock { 
    Set-Location $using:pwd
    $env:BROWSER = "none"  # Don't auto-open browser
    npm start 
}

# Wait for frontend to start
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "🎉 DevOpsify E-Commerce Application Started Successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:5001" -ForegroundColor Cyan
Write-Host "📊 Health Check: http://localhost:5001/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Demo Login Credentials:" -ForegroundColor Yellow
Write-Host "📧 Email: demo@devopsify.com" -ForegroundColor White
Write-Host "🔑 Password: demo123" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Function to cleanup on exit
function Stop-DevServices {
    Write-Host "`n🛑 Stopping services..." -ForegroundColor Yellow
    Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Write-Host "✅ All services stopped" -ForegroundColor Green
}

# Set up Ctrl+C handler
$null = Register-EngineEvent PowerShell.Exiting -Action { Stop-DevServices }

try {
    # Keep script running and show job status
    while ($true) {
        Start-Sleep -Seconds 30
        
        # Check if jobs are still running
        $backendRunning = (Get-Job $backendJob).State -eq "Running"
        $frontendRunning = (Get-Job $frontendJob).State -eq "Running"
        
        if (-not $backendRunning) {
            Write-Host "⚠️ Backend job stopped unexpectedly" -ForegroundColor Red
            break
        }
        
        if (-not $frontendRunning) {
            Write-Host "⚠️ Frontend job stopped unexpectedly" -ForegroundColor Red
            break
        }
    }
}
finally {
    Stop-DevServices
}
