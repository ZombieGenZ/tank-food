@REM Bản quyền (c) 2025 TANK Groups
@REM
@REM Tác phẩm này được cấp phép theo Giấy phép Creative Commons
@REM Attribution-NonCommercial-NoDerivatives 4.0 International.
@REM Để xem một bản sao của giấy phép này, vui lòng truy cập
@REM http://creativecommons.org/licenses/by-nc-nd/4.0/

@echo off
chcp 65001 > nul
title TANK-Food Server

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

echo !ESC![1;36m=== ĐANG BẮT ĐẦU QUY TRÌNH TRIỂN KHAI TANK-FOOD SERVER ===!ESC![0m
echo.
echo !ESC![1;33m[KIỂM TRA]!ESC![0m Đang kiểm tra thư mục node_modules...
set NEEDS_INSTALL=0

if not exist node_modules\ (
    echo !ESC![1;31m[CẢNH BÁO]!ESC![0m Không tìm thấy thư mục node_modules!
    set NEEDS_INSTALL=1
) else (
    dir /a:d /b "node_modules\*" >nul 2>&1
    if errorlevel 1 (
        echo !ESC![1;31m[CẢNH BÁO]!ESC![0m Thư mục node_modules tồn tại nhưng không có thư mục con!
        set NEEDS_INSTALL=1
    ) else (
        echo !ESC![1;32m[OK]!ESC![0m Thư mục node_modules đã tồn tại và có các package. Bỏ qua bước cài đặt.
    )
)

if %NEEDS_INSTALL% equ 1 (
    echo !ESC![1;34m[HÀNH ĐỘNG]!ESC![0m Đang cài đặt dependencies...
    echo.
    call npm i
    if %errorlevel% neq 0 (
        echo.
        echo !ESC![1;31m[LỖI]!ESC![0m Cài đặt dependencies thất bại!
        echo !ESC![1;31m[DỪNG]!ESC![0m Quy trình đã bị dừng do lỗi.
        pause
        exit /b 1
    )
    echo.
    echo !ESC![1;32m[THÀNH CÔNG]!ESC![0m Cài đặt dependencies hoàn tất!
)
echo.

echo !ESC![1;33m[KIỂM TRA]!ESC![0m Đang kiểm tra thư mục dist...
set NEEDS_BUILD=0

if not exist dist\ (
    echo !ESC![1;31m[CẢNH BÁO]!ESC![0m Không tìm thấy thư mục dist!
    set NEEDS_BUILD=1
) else (
    if not exist "dist\index.js" (
        echo !ESC![1;31m[CẢNH BÁO]!ESC![0m Thư mục dist tồn tại nhưng không tìm thấy file index.js!
        set NEEDS_BUILD=1
    ) else (
        for /f %%i in ("dist\index.js") do set size=%%~zi
        if !size! EQU 0 (
            echo !ESC![1;31m[CẢNH BÁO]!ESC![0m File index.js tồn tại nhưng trống!
            set NEEDS_BUILD=1
        ) else (
            echo !ESC![1;32m[OK]!ESC![0m Thư mục dist đã tồn tại và có nội dung hợp lệ. Bỏ qua bước build.
        )
    )
)

if %NEEDS_BUILD% equ 1 (
    echo !ESC![1;34m[HÀNH ĐỘNG]!ESC![0m Đang chạy build...
    echo.
    call npm run build
    if %errorlevel% neq 0 (
        echo.
        echo !ESC![1;31m[LỖI]!ESC![0m Quy trình build thất bại!
        echo !ESC![1;31m[DỪNG]!ESC![0m Quy trình đã bị dừng do lỗi.
        pause
        exit /b 1
    )
    echo.
    echo !ESC![1;32m[THÀNH CÔNG]!ESC![0m Build hoàn tất!
)
echo.

echo !ESC![1;34m[HÀNH ĐỘNG]!ESC![0m Đang khởi động TANK-Food Server...
echo.
call npm run start
if %errorlevel% neq 0 (
    echo.
    echo !ESC![1;31m[LỖI]!ESC![0m Khởi động máy chủ thất bại!
    pause
    exit /b 1
)

echo.
echo !ESC![1;32m=== QUY TRÌNH HOÀN TẤT ===!ESC![0m
pause
