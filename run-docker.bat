@echo off
REM Docker startup script for TicTacToeApp

echo.
echo ========================================
echo TicTacToeApp - Docker Startup
echo ========================================
echo.

if "%1"=="start" (
    echo Starting Docker container...
    docker-compose up -d
    echo.
    echo Container started! Access the app at:
    echo   - Web: http://localhost:19000
    echo   - Expo Go: Scan the QR code in terminal
    echo.
    echo View logs with: docker-compose logs -f tictactoe
    echo.
) else if "%1"=="stop" (
    echo Stopping Docker container...
    docker-compose down
    echo Container stopped!
    echo.
) else if "%1"=="logs" (
    echo Showing Docker logs (press Ctrl+C to stop)...
    docker-compose logs -f tictactoe
) else if "%1"=="restart" (
    echo Restarting Docker container...
    docker-compose restart
    echo Container restarted!
    echo.
) else if "%1"=="build" (
    echo Building Docker image...
    docker-compose build --no-cache
    echo Image built!
    echo.
) else (
    echo Usage: run-docker.bat [command]
    echo.
    echo Commands:
    echo   start    - Start the Docker container
    echo   stop     - Stop the Docker container
    echo   restart  - Restart the Docker container
    echo   logs     - View container logs
    echo   build    - Build the Docker image
    echo.
    echo Example: run-docker.bat start
    echo.
)
