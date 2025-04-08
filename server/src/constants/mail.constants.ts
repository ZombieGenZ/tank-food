import { formatDateOnlyMonthAndYear } from '~/utils/date.utils'
import { OverviewResponseWithComparison } from './statistical.constants'
import { ProductList } from './orders.constants'
import { LANGUAGE } from './language.constants'

export class VIETNAMESE_DYNAMIC_MAIL {
  static welcomeMail(display_name: string) {
    return {
      subject: `Chào mừng đến ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
                <tr>
                    <td style="background-color: #FF8000; padding: 40px; text-align: center; position: relative;">
                        <div style="position: relative;">
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                            <div style="width: 80px; height: 4px; background-color: #FFFFFF; margin: 15px auto; border-radius: 2px;"></div>
                            <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic; text-shadow: 1px 1px 4px rgba(0,0,0,0.2);">${process.env.SLOGAN}</p>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #D62300; padding: 50px 40px; text-align: center; position: relative;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 1px 1px 5px rgba(0,0,0,0.2);">Chào mừng bạn đến với ${process.env.TRADEMARK_NAME}!</h2>
                        <div style="width: 60px; height: 3px; background-color: #FFFFFF; margin: 20px auto; opacity: 0.8; border-radius: 2px;"></div>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; max-width: 450px; display: inline-block; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);">Cảm ơn bạn đã đăng ký tài khoản</p>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 50px 40px; background-color: #FFFFFF; background-image: linear-gradient(rgba(242,242,242,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,242,0.5) 1px, transparent 1px); background-size: 20px 20px; background-position: -1px -1px;">
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; font-weight: 500;">Xin chào ${display_name},</p>
                        
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; line-height: 1.7;">Chúng tôi rất vui mừng khi bạn đã trở thành thành viên của gia đình ${process.env.TRADEMARK_NAME}! Từ bây giờ, bạn có thể:</p>
                        
                        <div style="background-color: #F2F2F2; padding: 30px; margin: 30px 0; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; left: 0; width: 8px; height: 100%; background-color: #FF8000;"></div>
                            <ul style="padding-left: 20px; margin: 0; list-style-type: none;">
                                <li style="margin-bottom: 20px; position: relative; padding-left: 35px;">
                                    <div style="position: absolute; left: 0; top: 0; width: 24px; height: 24px; background-color: #FF8000; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <div style="color: #FFFFFF; font-weight: bold; font-size: 14px;">✓</div>
                                    </div>
                                    <span style="font-size: 17px; font-weight: 500;">Đặt món ăn nhanh chóng với chỉ vài cú nhấp chuột</span>
                                </li>
                                <li style="margin-bottom: 0; position: relative; padding-left: 35px;">
                                    <div style="position: absolute; left: 0; top: 0; width: 24px; height: 24px; background-color: #FF8000; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <div style="color: #FFFFFF; font-weight: bold; font-size: 14px;">✓</div>
                                    </div>
                                    <span style="font-size: 17px; font-weight: 500;">Theo dõi đơn hàng theo thời gian thực</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${process.env.APP_URL}" style="background-color: #FF8000; color: #FFFFFF; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 18px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 8px 20px rgba(255,128,0,0.4); transition: all 0.3s ease; position: relative; overflow: hidden;">
                                <span style="position: relative; z-index: 1;">ĐẶT MÓN NGAY</span>
                            </a>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 0;">
                        <div style="background-color: #F2F2F2; padding: 40px; border-top: 1px solid #E5E5E5; border-bottom: 1px solid #E5E5E5; text-align: center;">
                            <h3 style="color: #D62300; margin: 0 0 20px 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">TRUY CẬP WEBSITE CHÍNH THỨC</h3>
                            <p style="margin: 0 0 25px 0; font-size: 16px; color: #555555; max-width: 450px; display: inline-block; line-height: 1.7;">Khám phá đầy đủ menu, ưu đãi đặc biệt và các địa điểm gần bạn tại website chính thức của chúng tôi.</p>
                            <a href="${process.env.APP_URL}" style="display: inline-block; background-color: #FFFFFF; color: #FF8000; font-weight: bold; padding: 12px 25px; border: 2px solid #FF8000; border-radius: 6px; text-decoration: none; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">${process.env.APP_URL_DISPLAY}</a>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #D62300; padding: 40px; text-align: center; position: relative;">
                        <p style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 15px; opacity: 0.9;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Tất cả các quyền được bảo lưu.</p>
                        <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px; transition: all 0.3s ease;">Website</a>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
  static emailVerifyMail(url: string) {
    return {
      subject: `Xác thực tài khoản - ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
                <tr>
                    <td style="background-color: #FF8000; padding: 40px; text-align: center; position: relative;">
                        <div style="position: relative;">
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                            <div style="width: 80px; height: 4px; background-color: #FFFFFF; margin: 15px auto; border-radius: 2px;"></div>
                            <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic; text-shadow: 1px 1px 4px rgba(0,0,0,0.2);">${process.env.SLOGAN}</p>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #D62300; padding: 50px 40px; text-align: center; position: relative;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 1px 1px 5px rgba(0,0,0,0.2);">Xác thực Tài khoản của Bạn</h2>
                        <div style="width: 60px; height: 3px; background-color: #FFFFFF; margin: 20px auto; opacity: 0.8; border-radius: 2px;"></div>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; max-width: 450px; display: inline-block; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);">Chỉ còn một bước nữa để thưởng thức ẩm thực tuyệt vời!</p>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 50px 40px; background-color: #FFFFFF; background-image: linear-gradient(rgba(242,242,242,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,242,0.5) 1px, transparent 1px); background-size: 20px 20px; background-position: -1px -1px;">
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; font-weight: 500;">Xin chào,</p>
                        
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; line-height: 1.7;">Cảm ơn bạn đã đăng ký tài khoản tại ${process.env.TRADEMARK_NAME}. Để hoàn tất quá trình đăng ký, vui lòng xác thực email của bạn bằng cách nhấp vào nút bên dưới:</p>
                        
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${url}" style="background-color: #FF8000; color: #FFFFFF; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 18px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 8px 20px rgba(255,128,0,0.4); transition: all 0.3s ease; position: relative; overflow: hidden;">
                                <span style="position: relative; z-index: 1;">XÁC THỰC TÀI KHOẢN</span>
                            </a>
                        </div>
                        
                        <p style="margin: 30px 0 15px 0; font-size: 18px; color: #333333; line-height: 1.7;">Hoặc, bạn có thể sao chép và dán đường dẫn sau vào trình duyệt của mình:</p>
                        
                        <div style="background-color: #F2F2F2; padding: 20px; margin: 20px 0; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; left: 0; width: 8px; height: 100%; background-color: #FF8000;"></div>
                            <p style="padding-left: 15px; margin: 0; word-break: break-all; color: #333333; font-size: 15px; font-family: monospace;">${url}</p>
                        </div>
                        
                        <p style="margin: 30px 0 0 0; font-size: 18px; color: #333333; line-height: 1.7;"><strong>Lưu ý:</strong> Liên kết này chỉ có hiệu lực trong 24 giờ.</p>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #D62300; padding: 40px; text-align: center; position: relative;">
                        <p style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 15px; opacity: 0.9;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Tất cả các quyền được bảo lưu.</p>
                        <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px; transition: all 0.3s ease;">Website</a>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
  static voucher(code: string, discount: number) {
    return {
      subject: `Mã giảm giá - ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #F2F2F2;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-collapse: collapse;">
                <tr>
                    <td style="background-color: #FF8000; padding: 20px; text-align: center;">
                        <h1 style="color: #FFFFFF; margin: 0; font-size: 28px;">${process.env.TRADEMARK_NAME}</h1>
                        <p style="color: #FFFFFF; margin: 5px 0 0 0; font-size: 16px;">${process.env.SLOGAN}</p>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #D62300; padding: 30px 20px; text-align: center;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 24px;">Chúng Tôi Xin Lỗi Về Đơn Hàng Của Bạn</h2>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 16px;">Chúng tôi đã gửi cho bạn một voucher đặc biệt như lời xin lỗi</p>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 30px 20px; background-color: #FFFFFF;">
                        <p style="color: #333333; margin: 0; font-size: 16px; line-height: 1.5;">Kính gửi Quý khách,</p>
                        <p style="color: #333333; margin: 15px 0; font-size: 16px; line-height: 1.5;">Chúng tôi xin lỗi vì đơn hàng gần đây của bạn đã bị hủy. Tại ${process.env.TRADEMARK_NAME}, chúng tôi luôn cố gắng cung cấp dịch vụ tốt nhất có thể, và rất tiếc khi không thể hoàn thành đơn hàng của bạn lần này.</p>
                        <p style="color: #333333; margin: 15px 0; font-size: 16px; line-height: 1.5;">Như một lời cảm ơn cho sự kiên nhẫn và thông cảm của bạn, chúng tôi rất vui được tặng bạn một ưu đãi đặc biệt cho đơn hàng tiếp theo.</p>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 0 20px 30px; text-align: center; background-color: #FFFFFF;">
                        <div style="border: 2px dashed #FF9A3D; padding: 20px; background-color: #F2F2F2; border-radius: 8px;">
                            <h3 style="color: #D62300; margin: 0; font-size: 20px;">VOUCHER ĐẶC BIỆT CỦA BẠN</h3>
                            <div style="background-color: #B01C00; padding: 15px; margin: 15px 0; border-radius: 5px;">
                                <p style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: bold;">GIẢM ${discount.toLocaleString('vi-VN')}₫</p>
                                <p style="color: #FFFFFF; margin: 5px 0 0 0; font-size: 14px;">Cho Đơn Hàng Tiếp Theo</p>
                            </div>
                            <p style="color: #333333; margin: 0; font-size: 16px;">Mã Voucher:</p>
                            <p style="color: #D62300; margin: 5px 0 15px 0; font-size: 22px; font-weight: bold; letter-spacing: 2px;">${code}</p>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 0 20px 30px; text-align: center; background-color: #FFFFFF;">
                        <a href="${process.env.APP_URL}" style="display: inline-block; background-color: #FF8000; color: #FFFFFF; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-size: 16px; font-weight: bold;">Đặt Hàng Ngay</a>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 20px; background-color: #F2F2F2; text-align: center;">
                        <p style="color: #333333; margin: 0; font-size: 14px; line-height: 1.5;">Voucher này có thể được sử dụng cho bất kỳ đơn hàng nào từ thực đơn của chúng tôi. Không thể kết hợp với các ưu đãi khác.</p>
                        <p style="color: #333333; margin: 15px 0 0 0; font-size: 14px;">Có câu hỏi? Liên hệ với dịch vụ khách hàng của chúng tôi tại <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #D62300; text-decoration: none;">${process.env.SUPPORT_EMAIL}</a></p>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #D62300; padding: 20px; text-align: center;">
                        <p style="color: #FFFFFF; margin: 0; font-size: 14px;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Tất cả các quyền được bảo lưu.</p>
                        <div style="margin-top: 15px;">
                            <a href="${process.env.APP_URL}" style="display: inline-block; background-color: transparent; color: #FFFFFF; text-decoration: none; border: 1px solid #FFFFFF; border-radius: 999px; padding: 8px 30px; font-size: 16px;">Website</a>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
  static forgotPassword(url: string) {
    return {
      subject: `Yêu cầu đặt lại mật khẩu - ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
                <tr>
                    <td style="background-color: #FF8000; padding: 40px; text-align: center; position: relative;">
                        <div style="position: relative;">
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                            <div style="width: 80px; height: 4px; background-color: #FFFFFF; margin: 15px auto; border-radius: 2px;"></div>
                            <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic; text-shadow: 1px 1px 4px rgba(0,0,0,0.2);">${process.env.SLOGAN}</p>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 50px 40px; text-align: center; position: relative;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 1px 1px 5px rgba(0,0,0,0.2);">Đặt lại Mật khẩu của Bạn</h2>
                        <div style="width: 60px; height: 3px; background-color: #FFFFFF; margin: 20px auto; opacity: 0.8; border-radius: 2px;"></div>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; max-width: 450px; display: inline-block; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);">Chỉ một bước để quay lại thưởng thức món ăn yêu thích!</p>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 50px 40px; background-color: #FFFFFF; background-image: linear-gradient(rgba(242,242,242,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,242,0.5) 1px, transparent 1px); background-size: 20px 20px; background-position: -1px -1px;">
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; font-weight: 500;">Xin chào,</p>
                        
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; line-height: 1.7;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản ${process.env.TRADEMARK_NAME} của bạn. Để đặt lại mật khẩu, vui lòng nhấp vào nút bên dưới:</p>
                        
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${url}" style="background-color: #FF9A3D; color: #FFFFFF; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 18px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 8px 20px rgba(255,154,61,0.4); transition: all 0.3s ease; position: relative; overflow: hidden;">
                                <span style="position: relative; z-index: 1;">ĐẶT LẠI MẬT KHẨU</span>
                            </a>
                        </div>
                        
                        <p style="margin: 30px 0 15px 0; font-size: 18px; color: #333333; line-height: 1.7;">Hoặc, bạn có thể sao chép và dán đường dẫn sau vào trình duyệt của mình:</p>
                        
                        <div style="background-color: #F2F2F2; padding: 20px; margin: 20px 0; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; left: 0; width: 8px; height: 100%; background-color: #FF8000;"></div>
                            <p style="padding-left: 15px; margin: 0; word-break: break-all; color: #333333; font-size: 15px; font-family: monospace;">${url}</p>
                        </div>
                        
                        <p style="margin: 30px 0 0 0; font-size: 18px; color: #333333; line-height: 1.7;"><strong>Lưu ý:</strong> Liên kết này chỉ có hiệu lực trong <span style="color: #FF9A3D; font-weight: bold;">12 giờ</span>.</p>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 40px; text-align: center; position: relative;">
                        <p style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 15px; opacity: 0.9;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Tất cả các quyền được bảo lưu.</p>
                        <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px; transition: all 0.3s ease;">Website</a>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
  static changePassword(date: string, location: string, ip: string, browser: string, os: string) {
    return {
      subject: `Thông Báo Thay Đổi Mật Khẩu - ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
                <tr>
                    <td style="background-color: #FF8000; padding: 40px; text-align: center; position: relative;">
                        <div style="position: relative;">
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                            <div style="width: 80px; height: 4px; background-color: #FFFFFF; margin: 15px auto; border-radius: 2px;"></div>
                            <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic; text-shadow: 1px 1px 4px rgba(0,0,0,0.2);">${process.env.SLOGAN}</p>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 50px 40px; text-align: center; position: relative;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 1px 1px 5px rgba(0,0,0,0.2);">Thay Đổi Mật Khẩu</h2>
                        <div style="width: 60px; height: 3px; background-color: #FFFFFF; margin: 20px auto; opacity: 0.8; border-radius: 2px;"></div>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; max-width: 450px; display: inline-block; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);">Mật khẩu tài khoản của bạn đã được thay đổi!</p>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 50px 40px; background-color: #FFFFFF; background-image: linear-gradient(rgba(242,242,242,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,242,0.5) 1px, transparent 1px); background-size: 20px 20px; background-position: -1px -1px;">
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; font-weight: 500;">Xin chào,</p>
                        
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; line-height: 1.7;">Chúng tôi ghi nhận một thay đổi mật khẩu trên tài khoản ${process.env.TRADEMARK_NAME} của bạn. Dưới đây là thông tin chi tiết:</p>
                        
                        <div style="background-color: #F2F2F2; padding: 20px; margin: 20px 0; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; left: 0; width: 8px; height: 100%; background-color: #FF8000;"></div>
                            <p style="padding-left: 15px; margin: 5px 0; color: #333333; font-size: 16px;"><strong>Thời gian:</strong> ${date}</p>
                            <p style="padding-left: 15px; margin: 5px 0; color: #333333; font-size: 16px;"><strong>Địa điểm:</strong> ${location}</p>
                            <p style="padding-left: 15px; margin: 5px 0; color: #333333; font-size: 16px;"><strong>Địa chỉ IP:</strong> ${ip}</p>
                            <p style="padding-left: 15px; margin: 5px 0; color: #333333; font-size: 16px;"><strong>Thiết bị:</strong> ${os} (${browser})</p>
                        </div>
                        
                        <p style="margin: 30px 0 15px 0; font-size: 18px; color: #333333; line-height: 1.7;">Nếu bạn <strong>không thực hiện thay đổi này</strong>, vui lòng liên hệ chúng tôi ngay tại <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #FF9A3D; text-decoration: none; font-weight: bold;">${process.env.SUPPORT_EMAIL}</a>.</p>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 40px; text-align: center; position: relative;">
                        <p style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 15px; opacity: 0.9;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Tất cả các quyền được bảo lưu.</p>
                        <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px; transition: all 0.3s ease;">Website</a>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
  static monthlyReport(date: Date, data: OverviewResponseWithComparison, comment: string) {
    const daysInPeriod: number = data.dailyBreakdown.length
    const maxRevenue: number = Math.max(...data.dailyBreakdown.map((day) => day.revenue))
    const formatNumber = (num: number): string => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    const getChangeStyle = (change: number): { color: string; symbol: string } => {
      if (change > 0) {
        return { color: '#2ecc71', symbol: '↑' }
      } else if (change < 0) {
        return { color: '#e74c3c', symbol: '↓' }
      } else {
        return { color: '#FF9A3D', symbol: '↔' }
      }
    }

    const dailyBars: string = data.dailyBreakdown
      .map((day) => {
        const height: number = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0
        return `<div style="width: ${100 / daysInPeriod}%; height: ${height}%; background-color: #FF8000;"></div>`
      })
      .join('')

    const revenueChange = getChangeStyle(data.comparison.totalRevenueChange)
    const ordersChange = getChangeStyle(data.comparison.totalOrdersChange)
    const productsChange = getChangeStyle(data.comparison.totalProductsChange)
    const customersChange = getChangeStyle(data.comparison.totalNewCustomersChange)

    return {
      subject: `Báo cáo hàng tháng - ${process.env.TRADEMARK_NAME}`,
      html: `
      <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
          <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
              <tr>
                  <td style="background-color: #FF8000; padding: 40px; text-align: center; position: relative;">
                      <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                      <div style="width: 80px; height: 4px; background-color: #FFFFFF; margin: 15px auto; border-radius: 2px;"></div>
                      <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic; text-shadow: 1px 1px 4px rgba(0,0,0,0.2);">${process.env.SLOGAN}</p>
                  </td>
              </tr>

              <tr>
                  <td style="background-color: #D62300; padding: 50px 40px; text-align: center; position: relative;">
                      <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 1px 1px 5px rgba(0,0,0,0.2);">Báo Cáo Hàng Tháng</h2>
                      <div style="width: 60px; height: 3px; background-color: #FFFFFF; margin: 20px auto; opacity: 0.8; border-radius: 2px;"></div>
                      <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; max-width: 450px; display: inline-block; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);">Thống kê tháng ${formatDateOnlyMonthAndYear(date)}</p>
                  </td>
              </tr>

              <tr>
                  <td style="padding: 50px 40px; background-color: #FFFFFF;">
                      <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; font-weight: 500;">Kính gửi Quản trị viên,</p>
                      
                      <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; line-height: 1.7;">Dưới đây là báo cáo hoạt động kinh doanh của TANK-Food trong tháng ${formatDateOnlyMonthAndYear(date)}:</p>

                      <table style="width: 100%; border-collapse: separate; border-spacing: 20px; margin-bottom: 30px;">
                          <tr>
                              <td style="width: 50%; background-color: #F2F2F2; border-radius: 8px; padding: 20px; box-sizing: border-box; border-left: 4px solid ${revenueChange.color}; vertical-align: top;">
                                  <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 16px; color: #333333;">Tổng Doanh Thu</h3>
                                  <p style="font-size: 24px; font-weight: bold; margin: 0; color: #333333;">${formatNumber(data.totalRevenue)}₫</p>
                                  <div style="display: flex; align-items: center; margin-top: 10px;">
                                      <span style="font-size: 14px; color: ${revenueChange.color}; margin-right: 5px;">${revenueChange.symbol} ${Math.abs(data.comparison.totalRevenueChange)}%</span>
                                      <span style="font-size: 13px; color: #7f8c8d;">so với tháng trước</span>
                                  </div>
                              </td>
                              <td style="width: 50%; background-color: #F2F2F2; border-radius: 8px; padding: 20px; box-sizing: border-box; border-left: 4px solid ${ordersChange.color}; vertical-align: top;">
                                  <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 16px; color: #333333;">Tổng Đơn Hàng</h3>
                                  <p style="font-size: 24px; font-weight: bold; margin: 0; color: #333333;">${data.totalOrders}</p>
                                  <div style="display: flex; align-items: center; margin-top: 10px;">
                                      <span style="font-size: 14px; color: ${ordersChange.color}; margin-right: 5px;">${ordersChange.symbol} ${Math.abs(data.comparison.totalOrdersChange)}%</span>
                                      <span style="font-size: 13px; color: #7f8c8d;">so với tháng trước</span>
                                  </div>
                              </td>
                          </tr>
                          <tr>
                              <td style="width: 50%; background-color: #F2F2F2; border-radius: 8px; padding: 20px; box-sizing: border-box; border-left: 4px solid ${productsChange.color}; vertical-align: top;">
                                  <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 16px; color: #333333;">Tổng Sản Phẩm Bán Ra</h3>
                                  <p style="font-size: 24px; font-weight: bold; margin: 0; color: #333333;">${data.totalProducts}</p>
                                  <div style="display: flex; align-items: center; margin-top: 10px;">
                                      <span style="font-size: 14px; color: ${productsChange.color}; margin-right: 5px;">${productsChange.symbol} ${Math.abs(data.comparison.totalProductsChange)}%</span>
                                      <span style="font-size: 13px; color: #7f8c8d;">so với tháng trước</span>
                                  </div>
                              </td>
                              <td style="width: 50%; background-color: #F2F2F2; border-radius: 8px; padding: 20px; box-sizing: border-box; border-left: 4px solid ${customersChange.color}; vertical-align: top;">
                                  <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 16px; color: #333333;">Khách Hàng Mới</h3>
                                  <p style="font-size: 24px; font-weight: bold; margin: 0; color: #333333;">${data.totalNewCustomers}</p>
                                  <div style="display: flex; align-items: center; margin-top: 10px;">
                                      <span style="font-size: 14px; color: ${customersChange.color}; margin-right: 5px;">${customersChange.symbol} ${Math.abs(data.comparison.totalNewCustomersChange)}%</span>
                                      <span style="font-size: 13px; color: #7f8c8d;">so với tháng trước</span>
                                  </div>
                              </td>
                          </tr>
                      </table>

                      <h3 style="font-size: 20px; color: #333333; margin: 30px 0 20px 0;">Doanh Thu Theo Ngày</h3>
                      <div style="width: 100%; height: 200px; background-color: #F2F2F2; border-radius: 8px; padding: 15px; position: relative;">
                          <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; display: flex; align-items: flex-end;">
                              ${dailyBars}
                          </div>
                          <div style="position: absolute; bottom: -20px; width: 100%; text-align: center; font-size: 12px; color: #7f8c8d;">${data.dailyBreakdown[0].date} - ${data.dailyBreakdown[daysInPeriod - 1].date}</div>
                      </div>

                      <h3 style="font-size: 20px; color: #333333; margin: 30px 0 20px 0;">Nhận Xét Tổng Thể</h3>
                      <div style="background-color: #F2F2F2; padding: 20px; border-radius: 8px; border-left: 4px solid #FF8000;">
                          <p style="margin: 0; font-size: 16px; color: #333333; line-height: 1.7;">
                              ${comment}
                          </p>
                      </div>
                  </td>
              </tr>

              <tr>
                  <td style="background-color: #D62300; padding: 40px; text-align: center; position: relative;">
                      <p style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 15px; opacity: 0.9;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Tất cả các quyền được bảo lưu.</p>
                      <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px;">Website</a>
                  </td>
              </tr>
          </table>
      </div>
      `
    }
  }
  static supportRequestResponse(contant: string) {
    return {
      subject: `Phản hồi yêu cầu hổ trợ - ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
                <tr>
                    <td style="background-color: #FF8000; padding: 40px; text-align: center;">
                        <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                        <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic;">${process.env.SLOGAN}</p>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 50px 40px; text-align: center;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700;">Phản hồi yêu cầu hỗ trợ</h2>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; line-height: 1.5;">Chúng tôi đã nhận được yêu cầu của bạn và đây là phản hồi từ đội ngũ hỗ trợ.</p>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 50px 40px; background-color: #FFFFFF;">
                        <p style="font-size: 18px; color: #333333; font-weight: 500;">Xin chào,</p>
                        <p style="font-size: 18px; color: #333333; line-height: 1.7;">Chúng tôi đã xem xét yêu cầu hỗ trợ của bạn và có phản hồi như sau:</p>
                        <div style="background-color: #F2F2F2; padding: 20px; margin: 20px 0; border-radius: 10px;">
                            <p style="color: #333333; font-size: 16px;">${contant}</p>
                        </div>
                        <p style="font-size: 18px; color: #333333; line-height: 1.7;">Nếu bạn cần thêm sự hỗ trợ, đừng ngần ngại liên hệ qua ${process.env.SUPPORT_EMAIL}. Chúng tôi luôn sẵn sàng phục vụ bạn!</p>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 40px; text-align: center;">
                        <p style="color: #FFFFFF; font-size: 15px;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Mọi quyền được bảo lưu.</p>
                        <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px;">Website</a>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
  static electronicInvoice(
    product_list: ProductList[],
    total_price: number,
    fee: number,
    vat: number,
    total_bill: number
  ) {
    let item_list = ``
    for (const item of product_list) {
      if (item.data.title_translate_1_language == LANGUAGE.VIETNAMESE) {
        item_list += `
          <tr style="border-bottom: 1px solid #FFFFFF;">
              <td style="padding: 10px; font-size: 16px; color: #333333;">${item.data.title_translate_1}</td>
              <td style="padding: 10px; text-align: center; font-size: 16px; color: #333333;">${item.quantity}</td>
              <td style="padding: 10px; text-align: right; font-size: 16px; color: #333333;">${item.price?.toLocaleString('vi-VN')} VNĐ</td>
          </tr>
        `
      } else {
        item_list += `
          <tr style="border-bottom: 1px solid #FFFFFF;">
              <td style="padding: 10px; font-size: 16px; color: #333333;">${item.data.title_translate_2}</td>
              <td style="padding: 10px; text-align: center; font-size: 16px; color: #333333;">${item.quantity}</td>
              <td style="padding: 10px; text-align: right; font-size: 16px; color: #333333;">${item.price?.toLocaleString('vi-VN')} VNĐ</td>
          </tr>
        `
      }

    }

    return {
      subject: `Hóa Đơn Điện Tử - ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
                <tr>
                    <td style="background-color: #FF8000; padding: 40px; text-align: center; position: relative;">
                        <div style="position: relative;">
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                            <div style="width: 80px; height: 4px; background-color: #FFFFFF; margin: 15px auto; border-radius: 2px;"></div>
                            <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic; text-shadow: 1px 1px 4px rgba(0,0,0,0.2);">${process.env.SLOGAN}</p>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 50px 40px; text-align: center; position: relative;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 1px 1px 5px rgba(0,0,0,0.2);">Hóa Đơn Điện Tử</h2>
                        <div style="width: 60px; height: 3px; background-color: #FFFFFF; margin: 20px auto; opacity: 0.8; border-radius: 2px;"></div>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; max-width: 450px; display: inline-block; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);">Cảm ơn bạn đã chọn ${process.env.TRADEMARK_NAME}!</p>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 50px 40px; background-color: #FFFFFF; background-image: linear-gradient(rgba(242,242,242,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,242,0.5) 1px, transparent 1px); background-size: 20px 20px; background-position: -1px -1px;">
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; font-weight: 500;">Xin chào,</p>
                        
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; line-height: 1.7;">Dưới đây là chi tiết hóa đơn của bạn từ ${process.env.TRADEMARK_NAME}:</p>
                        
                        <table style="width: 100%; background-color: #F2F2F2; padding: 20px; margin: 20px 0; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-collapse: collapse;">
                            <tr style="background-color: #FF9A3D; color: #FFFFFF;">
                                <th style="padding: 10px; text-align: left; font-size: 16px;">Tên hàng</th>
                                <th style="padding: 10px; text-align: center; font-size: 16px;">Số lượng</th>
                                <th style="padding: 10px; text-align: right; font-size: 16px;">Tổng giá</th>
                            </tr>
                            ${item_list}
                        </table>

                        <div style="text-align: right; margin: 20px 0;">
                            <p style="margin: 5px 0; font-size: 16px; color: #333333;"><strong>Tổng tiền hàng:</strong> ${total_price.toLocaleString('vi-VN')} VNĐ</p>
                            <p style="margin: 5px 0; font-size: 16px; color: #333333;"><strong>Phí vận chuyển:</strong> ${fee.toLocaleString('vi-VN')} VNĐ</p>
                            <p style="margin: 5px 0; font-size: 16px; color: #333333;"><strong>Thuế VAT (10%):</strong> ${vat.toLocaleString('vi-VN')} VNĐ</p>
                            <p style="margin: 5px 0; font-size: 18px; color: #B01C00; font-weight: bold;"><strong>Tổng thanh toán:</strong> ${total_bill.toLocaleString('vi-VN')} VNĐ</p>
                        </div>

                        <p style="margin: 30px 0 15px 0; font-size: 18px; color: #333333; line-height: 1.7;">Nếu bạn có thắc mắc, vui lòng liên hệ qua <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #FF9A3D; text-decoration: none; font-weight: bold;">${process.env.SUPPORT_EMAIL}</a>.</p>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 40px; text-align: center; position: relative;">
                        <p style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 15px; opacity: 0.9;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Mọi quyền được bảo lưu.</p>
                        <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px;">Website</a>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
}

export class ENGLIS_DYNAMIC_MAIL {
  static welcomeMail(display_name: string) {
    return {
      subject: `Welcome to ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
                <tr>
                    <td style="background-color: #FF8000; padding: 40px; text-align: center; position: relative;">
                        <div style="position: relative;">
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                            <div style="width: 80px; height: 4px; background-color: #FFFFFF; margin: 15px auto; border-radius: 2px;"></div>
                            <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic; text-shadow: 1px 1px 4px rgba(0,0,0,0.2);">${process.env.SLOGAN}</p>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #D62300; padding: 50px 40px; text-align: center; position: relative;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 1px 1px 5px rgba(0,0,0,0.2);">Welcome to ${process.env.TRADEMARK_NAME}!</h2>
                        <div style="width: 60px; height: 3px; background-color: #FFFFFF; margin: 20px auto; opacity: 0.8; border-radius: 2px;"></div>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; max-width: 450px; display: inline-block; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);">Thank you for registering an account</p>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 50px 40px; background-color: #FFFFFF; background-image: linear-gradient(rgba(242,242,242,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,242,0.5) 1px, transparent 1px); background-size: 20px 20px; background-position: -1px -1px;">
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; font-weight: 500;">Hello ${display_name},</p>
                        
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; line-height: 1.7;">We are thrilled that you’ve become a member of the ${process.env.TRADEMARK_NAME} family! From now on, you can:</p>
                        
                        <div style="background-color: #F2F2F2; padding: 30px; margin: 30px 0; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; left: 0; width: 8px; height: 100%; background-color: #FF8000;"></div>
                            <ul style="padding-left: 20px; margin: 0; list-style-type: none;">
                                <li style="margin-bottom: 20px; position: relative; padding-left: 35px;">
                                    <div style="position: absolute; left: 0; top: 0; width: 24px; height: 24px; background-color: #FF8000; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <div style="color: #FFFFFF; font-weight: bold; font-size: 14px;">✓</div>
                                    </div>
                                    <span style="font-size: 17px; font-weight: 500;">Order food quickly with just a few clicks</span>
                                </li>
                                <li style="margin-bottom: 0; position: relative; padding-left: 35px;">
                                    <div style="position: absolute; left: 0; top: 0; width: 24px; height: 24px; background-color: #FF8000; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <div style="color: #FFFFFF; font-weight: bold; font-size: 14px;">✓</div>
                                    </div>
                                    <span style="font-size: 17px; font-weight: 500;">Track your order in real-time</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${process.env.APP_URL}" style="background-color: #FF8000; color: #FFFFFF; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 18px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 8px 20px rgba(255,128,0,0.4); transition: all 0.3s ease; position: relative; overflow: hidden;">
                                <span style="position: relative; z-index: 1;">ORDER NOW</span>
                            </a>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 0;">
                        <div style="background-color: #F2F2F2; padding: 40px; border-top: 1px solid #E5E5E5; border-bottom: 1px solid #E5E5E5; text-align: center;">
                            <h3 style="color: #D62300; margin: 0 0 20px 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">VISIT OUR OFFICIAL WEBSITE</h3>
                            <p style="margin: 0 0 25px 0; font-size: 16px; color: #555555; max-width: 450px; display: inline-block; line-height: 1.7;">Explore our full menu, special offers, and locations near you on our official website.</p>
                            <a href="${process.env.APP_URL}" style="display: inline-block; background-color: #FFFFFF; color: #FF8000; font-weight: bold; padding: 12px 25px; border: 2px solid #FF8000; border-radius: 6px; text-decoration: none; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">${process.env.APP_URL_DISPLAY}</a>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #D62300; padding: 40px; text-align: center; position: relative;">
                        <p style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 15px; opacity: 0.9;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. All rights reserved.</p>
                        <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px; transition: all 0.3s ease;">Website</a>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
  static emailVerifyMail(url: string) {
    return {
      subject: `Account Verification - ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
                <tr>
                    <td style="background-color: #FF8000; padding: 40px; text-align: center; position: relative;">
                        <div style="position: relative;">
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                            <div style="width: 80px; height: 4px; background-color: #FFFFFF; margin: 15px auto; border-radius: 2px;"></div>
                            <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic; text-shadow: 1px 1px 4px rgba(0,0,0,0.2);">${process.env.SLOGAN}</p>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #D62300; padding: 50px 40px; text-align: center; position: relative;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 1px 1px 5px rgba(0,0,0,0.2);">Verify Your Account</h2>
                        <div style="width: 60px; height: 3px; background-color: #FFFFFF; margin: 20px auto; opacity: 0.8; border-radius: 2px;"></div>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; max-width: 450px; display: inline-block; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);">Just one more step to enjoy amazing food!</p>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 50px 40px; background-color: #FFFFFF; background-image: linear-gradient(rgba(242,242,242,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,242,0.5) 1px, transparent 1px); background-size: 20px 20px; background-position: -1px -1px;">
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; font-weight: 500;">Hello,</p>
                        
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; line-height: 1.7;">Thank you for registering an account at ${process.env.TRADEMARK_NAME}. To complete your registration, please verify your email by clicking the button below:</p>
                        
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${url}" style="background-color: #FF8000; color: #FFFFFF; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 18px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 8px 20px rgba(255,128,0,0.4); transition: all 0.3s ease; position: relative; overflow: hidden;">
                                <span style="position: relative; z-index: 1;">VERIFY ACCOUNT</span>
                            </a>
                        </div>
                        
                        <p style="margin: 30px 0 15px 0; font-size: 18px; color: #333333; line-height: 1.7;">Or, you can copy and paste the following link into your browser:</p>
                        
                        <div style="background-color: #F2F2F2; padding: 20px; margin: 20px 0; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; left: 0; width: 8px; height: 100%; background-color: #FF8000;"></div>
                            <p style="padding-left: 15px; margin: 0; word-break: break-all; color: #333333; font-size: 15px; font-family: monospace;">${url}</p>
                        </div>
                        
                        <p style="margin: 30px 0 0 0; font-size: 18px; color: #333333; line-height: 1.7;"><strong>Note:</strong> This link is valid for 24 hours only.</p>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #D62300; padding: 40px; text-align: center; position: relative;">
                        <p style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 15px; opacity: 0.9;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. All rights reserved.</p>
                        <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px; transition: all 0.3s ease;">Website</a>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
  static voucher(code: string, discount: number) {
    return {
      subject: `Discount Voucher - ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #F2F2F2;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-collapse: collapse;">
                <tr>
                    <td style="background-color: #FF8000; padding: 20px; text-align: center;">
                        <h1 style="color: #FFFFFF; margin: 0; font-size: 28px;">${process.env.TRADEMARK_NAME}</h1>
                        <p style="color: #FFFFFF; margin: 5px 0 0 0; font-size: 16px;">${process.env.SLOGAN}</p>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #D62300; padding: 30px 20px; text-align: center;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 24px;">We Apologize For Your Order</h2>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 16px;">We've sent you a special voucher as an apology</p>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 30px 20px; background-color: #FFFFFF;">
                        <p style="color: #333333; margin: 0; font-size: 16px; line-height: 1.5;">Dear Valued Customer,</p>
                        <p style="color: #333333; margin: 15px 0; font-size: 16px; line-height: 1.5;">We apologize for the cancellation of your recent order. At ${process.env.TRADEMARK_NAME}, we always strive to provide the best possible service, and we regret that we were unable to fulfill your order this time.</p>
                        <p style="color: #333333; margin: 15px 0; font-size: 16px; line-height: 1.5;">As a token of our appreciation for your patience and understanding, we are pleased to offer you a special discount for your next order.</p>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 0 20px 30px; text-align: center; background-color: #FFFFFF;">
                        <div style="border: 2px dashed #FF9A3D; padding: 20px; background-color: #F2F2F2; border-radius: 8px;">
                            <h3 style="color: #D62300; margin: 0; font-size: 20px;">YOUR SPECIAL VOUCHER</h3>
                            <div style="background-color: #B01C00; padding: 15px; margin: 15px 0; border-radius: 5px;">
                                <p style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: bold;">DISCOUNT ${discount.toLocaleString('en-US')}₫</p>
                                <p style="color: #FFFFFF; margin: 5px 0 0 0; font-size: 14px;">For Your Next Order</p>
                            </div>
                            <p style="color: #333333; margin: 0; font-size: 16px;">Voucher Code:</p>
                            <p style="color: #D62300; margin: 5px 0 15px 0; font-size: 22px; font-weight: bold; letter-spacing: 2px;">${code}</p>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 0 20px 30px; text-align: center; background-color: #FFFFFF;">
                        <a href="${process.env.APP_URL}/menu" style="display: inline-block; background-color: #FF8000; color: #FFFFFF; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-size: 16px; font-weight: bold;">Order Now</a>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 20px; background-color: #F2F2F2; text-align: center;">
                        <p style="color: #333333; margin: 0; font-size: 14px; line-height: 1.5;">This voucher can be used for any order from our menu. Cannot be combined with other offers.</p>
                        <p style="color: #333333; margin: 15px 0 0 0; font-size: 14px;">Have questions? Contact our customer service at <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #D62300; text-decoration: none;">${process.env.SUPPORT_EMAIL}</a></p>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #D62300; padding: 20px; text-align: center;">
                        <p style="color: #FFFFFF; margin: 0; font-size: 14px;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. All rights reserved.</p>
                        <div style="margin-top: 15px;">
                            <a href="${process.env.APP_URL}" style="display: inline-block; background-color: transparent; color: #FFFFFF; text-decoration: none; border: 1px solid #FFFFFF; border-radius: 999px; padding: 8px 30px; font-size: 16px;">Website</a>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
  static forgotPassword(url: string) {
    return {
      subject: `Password Reset Request - ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
                <tr>
                    <td style="background-color: #FF8000; padding: 40px; text-align: center; position: relative;">
                        <div style="position: relative;">
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                            <div style="width: 80px; height: 4px; background-color: #FFFFFF; margin: 15px auto; border-radius: 2px;"></div>
                            <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic; text-shadow: 1px 1px 4px rgba(0,0,0,0.2);">${process.env.SLOGAN}</p>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 50px 40px; text-align: center; position: relative;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 1px 1px 5px rgba(0,0,0,0.2);">Reset Your Password</h2>
                        <div style="width: 60px; height: 3px; background-color: #FFFFFF; margin: 20px auto; opacity: 0.8; border-radius: 2px;"></div>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; max-width: 450px; display: inline-block; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);">Just one step to get back to enjoying your favorite food!</p>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 50px 40px; background-color: #FFFFFF; background-image: linear-gradient(rgba(242,242,242,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,242,0.5) 1px, transparent 1px); background-size: 20px 20px; background-position: -1px -1px;">
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; font-weight: 500;">Hello,</p>
                        
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; line-height: 1.7;">We have received a request to reset the password for your ${process.env.TRADEMARK_NAME} account. To reset your password, please click the button below:</p>
                        
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="${url}" style="background-color: #FF9A3D; color: #FFFFFF; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; font-size: 18px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 8px 20px rgba(255,154,61,0.4); transition: all 0.3s ease; position: relative; overflow: hidden;">
                                <span style="position: relative; z-index: 1;">RESET PASSWORD</span>
                            </a>
                        </div>
                        
                        <p style="margin: 30px 0 15px 0; font-size: 18px; color: #333333; line-height: 1.7;">Or, you can copy and paste the following link into your browser:</p>
                        
                        <div style="background-color: #F2F2F2; padding: 20px; margin: 20px 0; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; left: 0; width: 8px; height: 100%; background-color: #FF8000;"></div>
                            <p style="padding-left: 15px; margin: 0; word-break: break-all; color: #333333; font-size: 15px; font-family: monospace;">${url}</p>
                        </div>
                        
                        <p style="margin: 30px 0 0 0; font-size: 18px; color: #333333; line-height: 1.7;"><strong>Note:</strong> This link is only valid for <span style="color: #FF9A3D; font-weight: bold;">12 hours</span>.</p>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 40px; text-align: center; position: relative;">
                        <p style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 15px; opacity: 0.9;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. All rights reserved.</p>
                        <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px; transition: all 0.3s ease;">Website</a>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
  static changePassword(date: string, location: string, ip: string, browser: string, os: string) {
    return {
      subject: `Password Change Notification - ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
                <tr>
                    <td style="background-color: #FF8000; padding: 40px; text-align: center; position: relative;">
                        <div style="position: relative;">
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                            <div style="width: 80px; height: 4px; background-color: #FFFFFF; margin: 15px auto; border-radius: 2px;"></div>
                            <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic; text-shadow: 1px 1px 4px rgba(0,0,0,0.2);">${process.env.SLOGAN}</p>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 50px 40px; text-align: center; position: relative;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 1px 1px 5px rgba(0,0,0,0.2);">Password Changed</h2>
                        <div style="width: 60px; height: 3px; background-color: #FFFFFF; margin: 20px auto; opacity: 0.8; border-radius: 2px;"></div>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; max-width: 450px; display: inline-block; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);">Your account password has been changed!</p>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 50px 40px; background-color: #FFFFFF; background-image: linear-gradient(rgba(242,242,242,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,242,0.5) 1px, transparent 1px); background-size: 20px 20px; background-position: -1px -1px;">
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; font-weight: 500;">Hello,</p>
                        
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; line-height: 1.7;">We have recorded a password change on your ${process.env.TRADEMARK_NAME} account. Below are the details:</p>
                        
                        <div style="background-color: #F2F2F2; padding: 20px; margin: 20px 0; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                            <div style="position: absolute; top: 0; left: 0; width: 8px; height: 100%; background-color: #FF8000;"></div>
                            <p style="padding-left: 15px; margin: 5px 0; color: #333333; font-size: 16px;"><strong>Time:</strong> ${date}</p>
                            <p style="padding-left: 15px; margin: 5px 0; color: #333333; font-size: 16px;"><strong>Location:</strong> ${location}</p>
                            <p style="padding-left: 15px; margin: 5px 0; color: #333333; font-size: 16px;"><strong>IP Address:</strong> ${ip}</p>
                            <p style="padding-left: 15px; margin: 5px 0; color: #333333; font-size: 16px;"><strong>Device:</strong> ${os} (${browser})</p>
                        </div>
                        
                        <p style="margin: 30px 0 15px 0; font-size: 18px; color: #333333; line-height: 1.7;">If you <strong>did not make this change</strong>, please contact us immediately at <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #FF9A3D; text-decoration: none; font-weight: bold;">${process.env.SUPPORT_EMAIL}</a>.</p>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 40px; text-align: center; position: relative;">
                        <p style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 15px; opacity: 0.9;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. All rights reserved.</p>
                        <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px; transition: all 0.3s ease;">Website</a>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
  static monthlyReport(date: Date, data: OverviewResponseWithComparison, comment: string) {
    const daysInPeriod: number = data.dailyBreakdown.length
    const maxRevenue: number = Math.max(...data.dailyBreakdown.map((day) => day.revenue))
    const formatNumber = (num: number): string => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    const getChangeStyle = (change: number): { color: string; symbol: string } => {
      if (change > 0) {
        return { color: '#2ecc71', symbol: '↑' }
      } else if (change < 0) {
        return { color: '#e74c3c', symbol: '↓' }
      } else {
        return { color: '#FF9A3D', symbol: '↔' }
      }
    }

    const dailyBars: string = data.dailyBreakdown
      .map((day) => {
        const height: number = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0
        return `<div style="width: ${100 / daysInPeriod}%; height: ${height}%; background-color: #FF8000;"></div>`
      })
      .join('')

    const revenueChange = getChangeStyle(data.comparison.totalRevenueChange)
    const ordersChange = getChangeStyle(data.comparison.totalOrdersChange)
    const productsChange = getChangeStyle(data.comparison.totalProductsChange)
    const customersChange = getChangeStyle(data.comparison.totalNewCustomersChange)

    return {
      subject: `Monthly Report - ${process.env.TRADEMARK_NAME}`,
      html: `
      <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
          <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
              <tr>
                  <td style="background-color: #FF8000; padding: 40px; text-align: center; position: relative;">
                      <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                      <div style="width: 80px; height: 4px; background-color: #FFFFFF; margin: 15px auto; border-radius: 2px;"></div>
                      <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic; text-shadow: 1px 1px 4px rgba(0,0,0,0.2);">${process.env.SLOGAN}</p>
                  </td>
              </tr>

              <tr>
                  <td style="backgroundColor: #D62300; padding: 50px 40px; text-align: center; position: relative;">
                      <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 1px 1px 5px rgba(0,0,0,0.2);">Monthly Report</h2>
                      <div style="width: 60px; height: 3px; background-color: #FFFFFF; margin: 20px auto; opacity: 0.8; border-radius: 2px;"></div>
                      <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; max-width: 450px; display: inline-block; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);">Statistics for ${formatDateOnlyMonthAndYear(date)}</p>
                  </td>
              </tr>

              <tr>
                  <td style="padding: 50px 40px; background-color: #FFFFFF;">
                      <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; font-weight: 500;">Dear Administrator,</p>
                      
                      <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; line-height: 1.7;">Below is the business performance report of TANK-Food for ${formatDateOnlyMonthAndYear(date)}:</p>

                      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                          <tr>
                              <td style="width: 50%; background-color: #F2F2F2; border-radius: 8px; padding: 15px; box-sizing: border-box; border-left: 4px solid ${revenueChange.color}; vertical-align: top;">
                                  <h3 style="margin-top: 0; margin-bottom: 5px; font-size: 16px; color: #333333;">Total Revenue</h3>
                                  <p style="font-size: 22px; font-weight: bold; margin: 0; color: #333333;">${formatNumber(data.totalRevenue)}₫</p>
                                  <div style="display: flex; align-items: center; margin-top: 8px;">
                                      <span style="font-size: 14px; color: ${revenueChange.color}; margin-right: 5px;">${revenueChange.symbol} ${Math.abs(data.comparison.totalRevenueChange)}%</span>
                                      <span style="font-size: 13px; color: #7f8c8d;">compared to last month</span>
                                  </div>
                              </td>
                              <td style="width: 50%; background-color: #F2F2F2; border-radius: 8px; padding: 15px; box-sizing: border-box; border-left: 4px solid ${ordersChange.color}; vertical-align: top;">
                                  <h3 style="margin-top: 0; margin-bottom: 5px; font-size: 16px; color: #333333;">Total Orders</h3>
                                  <p style="font-size: 22px; font-weight: bold; margin: 0; color: #333333;">${data.totalOrders}</p>
                                  <div style="display: flex; align-items: center; margin-top: 8px;">
                                      <span style="font-size: 14px; color: ${ordersChange.color}; margin-right: 5px;">${ordersChange.symbol} ${Math.abs(data.comparison.totalOrdersChange)}%</span>
                                      <span style="font-size: 13px; color: #7f8c8d;">compared to last month</span>
                                  </div>
                              </td>
                          </tr>
                          <tr>
                              <td style="width: 50%; background-color: #F2F2F2; border-radius: 8px; padding: 15px; box-sizing: border-box; border-left: 4px solid ${productsChange.color}; vertical-align: top;">
                                  <h3 style="margin-top: 0; margin-bottom: 5px; font-size: 16px; color: #333333;">Total Products Sold</h3>
                                  <p style="font-size: 22px; font-weight: bold; margin: 0; color: #333333;">${data.totalProducts}</p>
                                  <div style="display: flex; align-items: center; margin-top: 8px;">
                                      <span style="font-size: 14px; color: ${productsChange.color}; margin-right: 5px;">${productsChange.symbol} ${Math.abs(data.comparison.totalProductsChange)}%</span>
                                      <span style="font-size: 13px; color: #7f8c8d;">compared to last month</span>
                                  </div>
                              </td>
                              <td style="width: 50%; background-color: #F2F2F2; border-radius: 8px; padding: 15px; box-sizing: border-box; border-left: 4px solid ${customersChange.color}; vertical-align: top;">
                                  <h3 style="margin-top: 0; margin-bottom: 5px; font-size: 16px; color: #333333;">New Customers</h3>
                                  <p style="font-size: 22px; font-weight: bold; margin: 0; color: #333333;">${data.totalNewCustomers}</p>
                                  <div style="display: flex; align-items: center; margin-top: 8px;">
                                      <span style="font-size: 14px; color: ${customersChange.color}; margin-right: 5px;">${customersChange.symbol} ${Math.abs(data.comparison.totalNewCustomersChange)}%</span>
                                      <span style="font-size: 13px; color: #7f8c8d;">compared to last month</span>
                                  </div>
                              </td>
                          </tr>
                      </table>

                      <h3 style="font-size: 20px; color: #333333; margin: 30px 0 20px 0;">Daily Revenue</h3>
                      <div style="width: 100%; height: 200px; background-color: #F2F2F2; border-radius: 8px; padding: 15px; position: relative;">
                          <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; display: flex; align-items: flex-end;">
                              ${dailyBars}
                          </div>
                          <div style="position: absolute; bottom: -20px; width: 100%; text-align: center; font-size: 12px; color: #7f8c8d;">${data.dailyBreakdown[0].date} - ${data.dailyBreakdown[daysInPeriod - 1].date}</div>
                      </div>

                      <h3 style="font-size: 20px; color: #333333; margin: 30px 0 20px 0;">Overall Comments</h3>
                      <div style="background-color: #F2F2F2; padding: 20px; border-radius: 8px; border-left: 4px solid #FF8000;">
                          <p style="margin: 0; font-size: 16px; color: #333333; line-height: 1.7;">
                              ${comment}
                          </p>
                      </div>
                  </td>
              </tr>

              <tr>
                  <td style="background-color: #D62300; padding: 40px; text-align: center; position: relative;">
                      <p style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 15px; opacity: 0.9;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. All rights reserved.</p>
                      <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px;">Website</a>
                  </td>
              </tr>
          </table>
      </div>
      `
    }
  }
  static supportRequestResponse(contant: string) {
    return {
      subject: `Support Request Response - ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
                <tr>
                    <td style="background-color: #FF8000; padding: 40px; text-align: center;">
                        <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                        <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic;">${process.env.SLOGAN}</p>
                    </td>
                </tr>
  
                <tr>
                    <td style="background-color: #D62300; padding: 50px 40px; text-align: center;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700;">Support Request Response</h2>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; line-height: 1.5;">We have received your request, and here is the response from our support team.</p>
                    </td>
                </tr>
  
                <tr>
                    <td style="padding: 50px 40px; background-color: #FFFFFF;">
                        <p style="font-size: 18px; color: #333333; font-weight: 500;">Hello,</p>
                        <p style="font-size: 18px; color: #333333; line-height: 1.7;">We have reviewed your support request and here is our response:</p>
                        <div style="background-color: #F2F2F2; padding: 20px; margin: 20px 0; border-radius: 10px;">
                            <p style="color: #333333; font-size: 16px;">${contant}</p>
                        </div>
                        <p style="font-size: 18px; color: #333333; line-height: 1.7;">If you need further assistance, don't hesitate to reach out to us at ${process.env.SUPPORT_EMAIL}. We are always ready to assist you!</p>
                    </td>
                </tr>
  
                <tr>
                    <td style="background-color: #D62300; padding: 40px; text-align: center;">
                        <p style="color: #FFFFFF; font-size: 15px;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. All rights reserved.</p>
                        <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px;">Website</a>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
  static electronicInvoice(
    product_list: ProductList[],
    total_price: number,
    fee: number,
    vat: number,
    total_bill: number
  ) {
    let item_list = ``
    for (const item of product_list) {
      if (item.data.title_translate_1_language == LANGUAGE.ENGLISH) {
        item_list += `
          <tr style="border-bottom: 1px solid #FFFFFF;">
              <td style="padding: 10px; font-size: 16px; color: #333333;">${item.data.title_translate_1}</td>
              <td style="padding: 10px; text-align: center; font-size: 16px; color: #333333;">${item.quantity}</td>
              <td style="padding: 10px; text-align: right; font-size: 16px; color: #333333;">${item.price?.toLocaleString('vi-VN')} VNĐ</td>
          </tr>
        `
      } else {
        item_list += `
          <tr style="border-bottom: 1px solid #FFFFFF;">
              <td style="padding: 10px; font-size: 16px; color: #333333;">${item.data.title_translate_2}</td>
              <td style="padding: 10px; text-align: center; font-size: 16px; color: #333333;">${item.quantity}</td>
              <td style="padding: 10px; text-align: right; font-size: 16px; color: #333333;">${item.price?.toLocaleString('vi-VN')} VNĐ</td>
          </tr>
        `
      }

    }

    return {
      subject: `Electronic Invoice - ${process.env.TRADEMARK_NAME}`,
      html: `
        <div style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
                <tr>
                    <td style="background-color: #FF8000; padding: 40px; text-align: center; position: relative;">
                        <div style="position: relative;">
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                            <div style="width: 80px; height: 4px; background-color: #FFFFFF; margin: 15px auto; border-radius: 2px;"></div>
                            <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic; text-shadow: 1px 1px 4px rgba(0,0,0,0.2);">${process.env.SLOGAN}</p>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 50px 40px; text-align: center; position: relative;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 1px 1px 5px rgba(0,0,0,0.2);">Electronic Invoice</h2>
                        <div style="width: 60px; height: 3px; background-color: #FFFFFF; margin: 20px auto; opacity: 0.8; border-radius: 2px;"></div>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; max-width: 450px; display: inline-block; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);">Thank you for choosing ${process.env.TRADEMARK_NAME}!</p>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 50px 40px; background-color: #FFFFFF; background-image: linear-gradient(rgba(242,242,242,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,242,0.5) 1px, transparent 1px); background-size: 20px 20px; background-position: -1px -1px;">
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; font-weight: 500;">Hello,</p>
                        
                        <p style="margin: 0 0 25px 0; font-size: 18px; color: #333333; line-height: 1.7;">Below are the details of your invoice from ${process.env.TRADEMARK_NAME}:</p>
                        
                        <table style="width: 100%; background-color: #F2F2F2; padding: 20px; margin: 20px 0; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-collapse: collapse;">
                            <tr style="background-color: #FF9A3D; color: #FFFFFF;">
                                <th style="padding: 10px; text-align: left; font-size: 16px;">Item Name</th>
                                <th style="padding: 10px; text-align: center; font-size: 16px;">Quantity</th>
                                <th style="padding: 10px; text-align: right; font-size: 16px;">Total Price</th>
                            </tr>
                            ${item_list}
                        </table>

                        <div style="text-align: right; margin: 20px 0;">
                            <p style="margin: 5px 0; font-size: 16px; color: #333333;"><strong>Subtotal:</strong> ${total_price.toLocaleString('vi-VN')} VNĐ</p>
                            <p style="margin: 5px 0; font-size: 16px; color: #333333;"><strong>Shipping Fee:</strong> ${fee.toLocaleString('vi-VN')} VNĐ</p>
                            <p style="margin: 5px 0; font-size: 16px; color: #333333;"><strong>VAT (10%):</strong> ${vat.toLocaleString('vi-VN')} VNĐ</p>
                            <p style="margin: 5px 0; font-size: 18px; color: #B01C00; font-weight: bold;"><strong>Total Payment:</strong> ${total_bill.toLocaleString('vi-VN')} VNĐ</p>
                        </div>

                        <p style="margin: 30px 0 15px 0; font-size: 18px; color: #333333; line-height: 1.7;">If you have any questions, please feel free to contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #FF9A3D; text-decoration: none; font-weight: bold;">${process.env.SUPPORT_EMAIL}</a>.</p>
                    </td>
                </tr>

                <tr>
                    <td style="background-color: #D62300; padding: 40px; text-align: center; position: relative;">
                        <p style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 15px; opacity: 0.9;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. All rights reserved.</p>
                        <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px;">Website</a>
                    </td>
                </tr>
            </table>
        </div>
      `
    }
  }
}
