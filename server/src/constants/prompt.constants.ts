import { formatDateOnlyDayAndMonthAndYear, formatDateOnlyMonthAndYear } from '~/utils/date.utils'
import { LANGUAGE } from './language.constants'
import { OverviewResponseWithComparison } from './statistical.constants'

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
  static calculateShippingCosts(delivery_address: string, receiving_address: string) {
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
  static reportComment(startTime: Date, endTime: Date, language: string, data: OverviewResponseWithComparison) {
    return `
Bạn là chuyên gia phân tích kinh doanh cao cấp với hơn 15 năm kinh nghiệm trong lĩnh vực tài chính và chiến lược kinh doanh.

Thời gian tạo báo cáo ${formatDateOnlyDayAndMonthAndYear(startTime)} - ${formatDateOnlyDayAndMonthAndYear(endTime)}

Yêu cầu đầu ra:
- Viết nhận xét chuyên sâu, súc tích về tình hình kinh doanh của công ty TANK-Food.
- Độ dài: 200 - 500 ký tự.
- Phương pháp: Phân tích khách quan, chính xác, dựa trên dữ liệu cung cấp.
- Ngôn ngữ: Chuyên nghiệp, rõ ràng, có giá trị chiến lược.
- Sử dụng ${language == LANGUAGE.VIETNAMESE ? 'Tiếng Việt' : 'Tiếng anh'}

Hướng dẫn phân tích:
  - Đánh giá hiệu quả hoạt động kinh doanh:
    - So sánh doanh thu, số đơn hàng, số sản phẩm đã bán, số khách hàng mới với kỳ trước và mục tiêu đặt ra.
    - Xác định xu hướng tăng trưởng hoặc suy giảm.
  - Xác định các điểm mạnh và thách thức:
    - Chỉ ra các yếu tố giúp tăng trưởng tốt.
    - Nhận diện các vấn đề cần cải thiện hoặc rủi ro tiềm ẩn.
  - Nhận xét chiến lược:
    - Đề xuất giải pháp cải thiện doanh thu, tối ưu đơn hàng.
    - Dự báo ngắn hạn dựa trên xu hướng hiện tại.

Lưu ý quan trọng:
- Nội dung cần mạch lạc, tránh lan man.
- Không chỉ mô tả số liệu mà phải rút ra kết luận có ý nghĩa.
- Nhấn mạnh yếu tố chiến lược và tác động dài hạn.

Dử liệu:
${JSON.stringify(data)}
    `.trim()
  }
}
