# Bản quyền (c) 2025 TANK Groups
#
# Tác phẩm này được cấp phép theo Giấy phép Creative Commons
# Attribution-NonCommercial-NoDerivatives 4.0 International.
# Để xem một bản sao của giấy phép này, vui lòng truy cập
# http://creativecommons.org/licenses/by-nc-nd/4.0/

export LANG="en_US.UTF-8"

ESC="\033"
YELLOW="${ESC}[33m"
GREEN="${ESC}[32m"
RED="${ESC}[31m"
CYAN="${ESC}[36m"
GRAY="${ESC}[90m"
YELLOW_BOLD="${ESC}[93m"
CYAN_BOLD="${ESC}[1;36m"
BLUE_BOLD="${ESC}[1;34m"
RED_BOLD="${ESC}[1;31m"
GREEN_BOLD="${ESC}[1;32m"
YELLOW_BOLD_TEXT="${ESC}[1;33m"
RESET="${ESC}[0m"

echo -ne "\033]0;TANK-Food Server\007"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║                                      ║"
echo "║  ${YELLOW_BOLD}████████╗ █████╗ ███╗  ██╗██╗  ██╗${RESET}  ║"
echo "║  ${YELLOW_BOLD}╚══██╔══╝██╔══██╗████╗ ██║██║ ██╔╝${RESET}  ║"
echo "║  ${YELLOW_BOLD}   ██║   ███████║██╔██╗██║█████╔╝ ${RESET}  ║"
echo "║  ${YELLOW_BOLD}   ██║   ██╔══██║██║╚████║██╔═██╗ ${RESET}  ║"
echo "║  ${YELLOW_BOLD}   ██║   ██║  ██║██║ ╚███║██║  ██╗${RESET}  ║"
echo "║  ${YELLOW_BOLD}   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚══╝╚═╝  ╚═╝${RESET}  ║"
echo "║  ${CYAN}███████╗ ██████╗  ██████╗ ██████╗ ${RESET}  ║"
echo "║  ${CYAN}██╔════╝██╔═══██╗██╔═══██╗██╔══██╗${RESET}  ║"
echo "║  ${CYAN}█████╗  ██║   ██║██║   ██║██║  ██║${RESET}  ║"
echo "║  ${CYAN}██╔══╝  ██║   ██║██║   ██║██║  ██║${RESET}  ║"
echo "║  ${CYAN}██║     ╚██████╔╝╚██████╔╝██████╔╝${RESET}  ║"
echo "║  ${CYAN}╚═╝      ╚═════╝  ╚═════╝ ╚═════╝ ${RESET}  ║"
echo "║                                      ║"
echo "║  ${GRAY}Bản quyền © 2025 TANK-Food Team${RESET}     ║"
echo "║  ${GRAY}Liên hệ: tankfood.support@gmail.com${RESET} ║"
echo "║                                      ║"
echo "╚══════════════════════════════════════╝"
echo ""

echo -e "${CYAN_BOLD}=== ĐANG BẮT ĐẦU QUY TRÌNH TRIỂN KHAI TANK-FOOD SERVER ===${RESET}"
echo ""

echo -e "${YELLOW_BOLD_TEXT}[KIỂM TRA]${RESET} Đang kiểm tra thư mục node_modules..."
NEEDS_INSTALL=0

if [ ! -d "node_modules" ]; then
    echo -e "${RED_BOLD}[CẢNH BÁO]${RESET} Không tìm thấy thư mục node_modules!"
    NEEDS_INSTALL=1
elif [ -z "$(ls -A node_modules)" ]; then
    echo -e "${RED_BOLD}[CẢNH BÁO]${RESET} Thư mục node_modules tồn tại nhưng không có thư mục con!"
    NEEDS_INSTALL=1
else
    echo -e "${GREEN_BOLD}[OK]${RESET} Thư mục node_modules đã tồn tại và có các package. Bỏ qua bước cài đặt."
fi

if [ $NEEDS_INSTALL -eq 1 ]; then
    echo -e "${BLUE_BOLD}[HÀNH ĐỘNG]${RESET} Đang cài đặt dependencies..."
    echo ""
    npm i
    if [ $? -ne 0 ]; then
        echo ""
        echo -e "${RED_BOLD}[LỖI]${RESET} Cài đặt dependencies thất bại!"
        echo -e "${RED_BOLD}[DỪNG]${RESET} Quy trình đã bị dừng do lỗi."
        read -p "Nhấn Enter để thoát..."
        exit 1
    fi
    echo ""
    echo -e "${GREEN_BOLD}[THÀNH CÔNG]${RESET} Cài đặt dependencies hoàn tất!"
fi
echo ""

echo -e "${YELLOW_BOLD_TEXT}[KIỂM TRA]${RESET} Đang kiểm tra thư mục dist..."
NEEDS_BUILD=0

if [ ! -d "dist" ]; then
    echo -e "${RED_BOLD}[CẢNH BÁO]${RESET} Không tìm thấy thư mục dist!"
    NEEDS_BUILD=1
elif [ ! -f "dist/index.js" ]; then
    echo -e "${RED_BOLD}[CẢNH BÁO]${RESET} Thư mục dist tồn tại nhưng không tìm thấy file index.js!"
    NEEDS_BUILD=1
elif [ ! -s "dist/index.js" ]; then
    echo -e "${RED_BOLD}[CẢNH BÁO]${RESET} File index.js tồn tại nhưng trống!"
    NEEDS_BUILD=1
else
    echo -e "${GREEN_BOLD}[OK]${RESET} Thư mục dist đã tồn tại và có nội dung hợp lệ. Bỏ qua bước build."
fi

if [ $NEEDS_BUILD -eq 1 ]; then
    echo -e "${BLUE_BOLD}[HÀNH ĐỘNG]${RESET} Đang chạy build..."
    echo ""
    npm run build
    if [ $? -ne 0 ]; then
        echo ""
        echo -e "${RED_BOLD}[LỖI]${RESET} Quy trình build thất bại!"
        echo -e "${RED_BOLD}[DỪNG]${RESET} Quy trình đã bị dừng do lỗi."
        read -p "Nhấn Enter để thoát..."
        exit 1
    fi
    echo ""
    echo -e "${GREEN_BOLD}[THÀNH CÔNG]${RESET} Build hoàn tất!"
fi
echo ""

echo -e "${BLUE_BOLD}[HÀNH ĐỘNG]${RESET} Đang khởi động TANK-Food Server..."
echo ""
npm run start
if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED_BOLD}[LỖI]${RESET} Khởi động máy chủ thất bại!"
    read -p "Nhấn Enter để thoát..."
    exit 1
fi

echo ""
echo -e "${GREEN_BOLD}=== QUY TRÌNH HOÀN TẤT ===${RESET}"
read -p "Nhấn Enter để thoát..."