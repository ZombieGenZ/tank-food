export LANG="en_US.UTF-8"

ESC="\033"
YELLOW="${ESC}[33m"
GREEN="${ESC}[32m"
RED="${ESC}[31m"
CYAN="${ESC}[36m"
GRAY="${ESC}[90m"
YELLOW_BOLD="${ESC}[93m"
RESET="${ESC}[0m"

echo -ne "\033]0;TANK-Food Client\007"

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

echo -e "${YELLOW}Đang cập nhật code từ GitHub...${RESET}"
git pull
if [ $? -ne 0 ]; then
    echo -e "${RED}Lỗi khi cập nhật code từ GitHub${RESET}"
    read -p "Nhấn Enter để thoát..."
    exit 1
fi
echo -e "${GREEN}Cập nhật code thành công!!${RESET}"
echo ""

gnome-terminal --title="TANK-Food Server" -- bash -c "cd \"$(dirname "$0")/server\" && ./run-release.sh; exec bash" &
gnome-terminal --title="TANK-Food Client" -- bash -c "cd \"$(dirname "$0")/client\" && ./run-release.sh; exec bash" &

exit 0