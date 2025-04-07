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

echo !ESC![1;33m[KIỂM TRA]!ESC![0m Đang kiểm tra package psutil...
python -c "import psutil" 2>nul
if %errorlevel% neq 0 (
    echo !ESC![1;31m[CẢNH BÁO]!ESC![0m Package psutil chưa được cài đặt!
    echo !ESC![1;34m[HÀNH ĐỘNG]!ESC![0m Đang cài đặt psutil...
    pip install psutil
    if %errorlevel% neq 0 (
        echo !ESC![1;31m[LỖI]!ESC![0m Cài đặt psutil thất bại!
        echo !ESC![1;31m[DỪNG]!ESC![0m Quy trình đã bị dừng do lỗi.
        pause
        exit /b 1
    )
    echo !ESC![1;32m[THÀNH CÔNG]!ESC![0m Cài đặt psutil hoàn tất!
) else (
    echo !ESC![1;32m[OK]!ESC![0m Package psutil đã được cài đặt.
)

echo.

echo !ESC![1;33m[KIỂM TRA]!ESC![0m Đang kiểm tra package websockets...
python -c "import websockets" 2>nul
if %errorlevel% neq 0 (
    echo !ESC![1;31m[CẢNH BÁO]!ESC![0m Package websockets chưa được cài đặt!
    echo !ESC![1;34m[HÀNH ĐỘNG]!ESC![0m Đang cài đặt websockets...
    pip install websockets
    if %errorlevel% neq 0 (
        echo !ESC![1;31m[LỖI]!ESC![0m Cài đặt websockets thất bại!
        echo !ESC![1;31m[DỪNG]!ESC![0m Quy trình đã bị dừng do lỗi.
        pause
        exit /b 1
    )
    echo !ESC![1;32m[THÀNH CÔNG]!ESC![0m Cài đặt websockets hoàn tất!
) else (
    echo !ESC![1;32m[OK]!ESC![0m Package websockets đã được cài đặt.
)

echo.

echo !ESC![1;34m[HÀNH ĐỘNG]!ESC![0m Đang chạy TANK-Food SysInfo Server...
echo.
python ./main.py
if %errorlevel% neq 0 (
    echo.
    echo !ESC![1;31m[LỖI]!ESC![0m Chạy TANK-Food SysInfo Server thất bại!
    pause
    exit /b 1
)

echo.
echo !ESC![1;32m=== QUY TRÌNH HOÀN TẤT ===!ESC![0m
pause