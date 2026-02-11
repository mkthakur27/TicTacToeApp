#!/usr/bin/env pwsh

# Docker startup script for TicTacToeApp (PowerShell version)

function Start-App {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "TicTacToeApp - Docker Startup" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
    Write-Host "Starting Docker container..." -ForegroundColor Yellow
    docker-compose up -d
    
    Write-Host "`nContainer started! Access the app at:" -ForegroundColor Green
    Write-Host "  - Web: http://localhost:19000" -ForegroundColor Cyan
    Write-Host "  - Expo Go: Scan the QR code in terminal`n" -ForegroundColor Cyan
    Write-Host "View logs with: docker-compose logs -f tictactoe`n" -ForegroundColor Gray
}

function Stop-App {
    Write-Host "`nStopping Docker container..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "Container stopped!`n" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "`nShowing Docker logs (press Ctrl+C to stop)...`n" -ForegroundColor Yellow
    docker-compose logs -f tictactoe
}

function Restart-App {
    Write-Host "`nRestarting Docker container..." -ForegroundColor Yellow
    docker-compose restart
    Write-Host "Container restarted!`n" -ForegroundColor Green
}

function Build-Image {
    Write-Host "`nBuilding Docker image..." -ForegroundColor Yellow
    docker-compose build --no-cache
    Write-Host "Image built!`n" -ForegroundColor Green
}

function Show-Usage {
    Write-Host "`nUsage: .\run-docker.ps1 [command]`n" -ForegroundColor Yellow
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  start    - Start the Docker container" -ForegroundColor Cyan
    Write-Host "  stop     - Stop the Docker container" -ForegroundColor Cyan
    Write-Host "  restart  - Restart the Docker container" -ForegroundColor Cyan
    Write-Host "  logs     - View container logs" -ForegroundColor Cyan
    Write-Host "  build    - Build the Docker image`n" -ForegroundColor Cyan
    Write-Host "Example: .\run-docker.ps1 start`n" -ForegroundColor Gray
}

# Main script logic
$Command = $args[0]

switch ($Command) {
    "start" { Start-App }
    "stop" { Stop-App }
    "restart" { Restart-App }
    "logs" { Show-Logs }
    "build" { Build-Image }
    default { Show-Usage }
}
