@REM Bản quyền (c) 2025 TANK Groups
@REM
@REM Tác phẩm này được cấp phép theo Giấy phép Creative Commons
@REM Attribution-NonCommercial-NoDerivatives 4.0 International.
@REM Để xem một bản sao của giấy phép này, vui lòng truy cập
@REM http://creativecommons.org/licenses/by-nc-nd/4.0/

@echo off
chcp 65001 > nul
title TANK-Food Client

setlocal EnableDelayedExpansion
set "ESC="
for /F "tokens=1,2 delims=#" %%a in ('"prompt #$H#$E# & echo on & for %%b in (1) do rem"') do (
  set "ESC=%%b"
)

color 0B
echo.
echo ╔══════════════════════════════════════╗
echo ║                                      ║
echo ║  !ESC![93m████████╗ █████╗ ███╗  ██╗██╗  ██╗!ESC![0m  ║
echo ║  !ESC![93m╚══██╔══╝██╔══██╗████╗ ██║██║ ██╔╝!ESC![0m  ║
echo ║  !ESC![93m   ██║   ███████║██╔██╗██║█████╔╝ !ESC![0m  ║
echo ║  !ESC![93m   ██║   ██╔══██║██║╚████║██╔═██╗ !ESC![0m  ║
echo ║  !ESC![93m   ██║   ██║  ██║██║ ╚███║██║  ██╗!ESC![0m  ║
echo ║  !ESC![93m   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚══╝╚═╝  ╚═╝!ESC![0m  ║
echo ║  !ESC![36m███████╗ ██████╗  ██████╗ ██████╗ !ESC![0m  ║
echo ║  !ESC![36m██╔════╝██╔═══██╗██╔═══██╗██╔══██╗!ESC![0m  ║
echo ║  !ESC![36m█████╗  ██║   ██║██║   ██║██║  ██║!ESC![0m  ║
echo ║  !ESC![36m██╔══╝  ██║   ██║██║   ██║██║  ██║!ESC![0m  ║
echo ║  !ESC![36m██║     ╚██████╔╝╚██████╔╝██████╔╝!ESC![0m  ║
echo ║  !ESC![36m╚═╝      ╚═════╝  ╚═════╝ ╚═════╝ !ESC![0m  ║
echo ║                                      ║
echo ║  !ESC![90mBản quyền © 2025 TANK-Food Team!ESC![0m     ║
echo ║  !ESC![90mLiên hệ: tankfood.support@gmail.com!ESC![0m ║
echo ║                                      ║
echo ╚══════════════════════════════════════╝
echo.

echo !ESC![33mĐang cập nhật code từ GitHub...!ESC![0m
git pull
if errorlevel 1 (
    echo !ESC![31mLỗi khi cập nhật code từ GitHub!ESC![0m
    pause
    exit /b 1
)
echo !ESC![32mCập nhật code thành công!!ESC![0m
echo.

start "TANK-Food Server" cmd /k "cd /d "%~dp0server" && call run-dev.bat"

start "TANK-Food Client" cmd /k "cd /d "%~dp0client" && call run-dev.bat"

exit