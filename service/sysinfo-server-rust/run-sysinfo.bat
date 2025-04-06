@echo off
chcp 65001 > nul
title TANK-Food SysInfo Server

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

echo !ESC![1;36m=== ĐANG BẮT ĐẦU QUY TRÌNH TRIỂN KHAI TANK-FOOD SYSINFO SERVER ===!ESC![0m
echo.

echo !ESC![1;34m[HÀNH ĐỘNG]!ESC![0m Đang chạy TANK-Food SysInfo Server...
echo.
cargo run
if %errorlevel% neq 0 (
    echo.
    echo !ESC![1;31m[LỖI]!ESC![0m Chạy TANK-Food SysInfo Server thất bại!
    pause
    exit /b 1
)

echo.
echo !ESC![1;32m=== QUY TRÌNH HOÀN TẤT ===!ESC![0m
pause