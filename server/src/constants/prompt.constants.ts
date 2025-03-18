export default class GeminiAIPrompt {
  static translate(content: string) {
    return `
Bạn là một chuyên gia dịch thuật, thành thạo cả tiếng Việt và tiếng Anh (Mỹ).
Hãy dịch văn bản theo các quy tắc sau:
- Nếu đầu vào là tiếng Việt, dịch sang tiếng Anh và thêm tiền tố "vi-VN to en-US" vào đầu văn bản.
- Nếu đầu vào là tiếng Anh, dịch sang tiếng Việt và thêm tiền tố "en-US to vi-VN" vào đầu văn bản.
- Chỉ trả về bản dịch với tiền tố tương ứng, không giải thích hay thêm nội dung thừa.
- Đảm bảo bản dịch tự nhiên, đúng ngữ cảnh và giữ nguyên ý nghĩa gốc.
- Giữ nguyên các thuật ngữ kỹ thuật, tên riêng và số liệu.
- Duy trì định dạng gốc (như đánh dấu đậm, in nghiêng, danh sách) trong bản dịch.
Hãy dịch đoạn văn bản sau:
${content}
    `.trim()
  }
  static CalculateShippingCosts(delivery_address: string, receiving_address: string) {
    return `
Bạn là một chuyên gia tính toán khoảng cách và chi phí di chuyển. Khi tôi cung cấp hai địa chỉ, hãy:

1. Xác định quốc gia của mỗi địa chỉ

2. Tính quãng đường di chuyển bằng xe máy (tính bằng km, chỉ lấy phần nguyên)
   - Nếu quãng đường < 1 km, ghi là 0 km
   
3. Tính chi phí:
   - Nếu cùng quốc gia: [số km] × ${process.env.DOMESTIC_SHIPPING_FEE} VND
   - Nếu khác quốc gia: [số km] × ${process.env.INTERNATIONAL_SHIPPING_FEE} VND + [phí nhập cảnh của quốc gia thứ hai]
     (Sử dụng dữ liệu thực tế về phí nhập cảnh nếu có)

4. Thêm thông tin về tuyến đường đề xuất và thời gian ước tính

Trả về kết quả theo cấu trúc sau (không thêm bất cứ giải thích nào khác):
Địa điểm xuất phát: [địa chỉ 1]
Địa điểm đến: [địa chỉ 2]
Quốc gia xuất phát: [quốc gia 1]
Quốc gia đến: [quốc gia 2]
Khoảng cách: [số km] km
Chi phí di chuyển: [số tiền] VND
Tuyến đường đề xuất: [mô tả ngắn gọn]
Thời gian ước tính: [giờ:phút]

Dữ liệu:
Địa chỉ giao: ${delivery_address}
Địa chỉ nhận: ${receiving_address}
    `.trim()
  }
}
