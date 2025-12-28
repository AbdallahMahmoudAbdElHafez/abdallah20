@echo off
set "BASE_DIR=%~dp0.."
:: Navigating to server directory and starting the backend
cd /d "%BASE_DIR%\server"
start /b cmd /c "npm run start"

:: Navigating to client directory and starting the frontend
cd /d "%BASE_DIR%\client"
start /b cmd /c "npm run dev"

:: Waiting for services to start
timeout /t 10 /nobreak

:: Opening the application in the default browser
start http://localhost:5173
