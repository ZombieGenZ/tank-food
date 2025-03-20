export class VIETNAMESE_DYNAMIC_MAIL {
  static welcomeMail(display_name: string) {
    return {
      subject: `Chào mừng đến ${process.env.TRADEMARK_NAME}`,
      html: `
        <body style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
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
        </body>
      `
    }
  }
  static emailVerifyMail(url: string) {
    return {
      subject: `Xác thực tài khoản - ${process.env.TRADEMARK_NAME}`,
      html: `
        <body style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border-radius: 12px; overflow: hidden;">
                <!-- Header with solid color -->
                <tr>
                    <td style="background-color: #FF8000; padding: 40px; text-align: center; position: relative;">
                        <div style="position: relative;">
                            <h1 style="color: #FFFFFF; margin: 0; font-size: 42px; letter-spacing: 2px; text-transform: uppercase; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); font-weight: 800;">${process.env.TRADEMARK_NAME}</h1>
                            <div style="width: 80px; height: 4px; background-color: #FFFFFF; margin: 15px auto; border-radius: 2px;"></div>
                            <p style="color: #FFFFFF; margin: 10px 0 0 0; font-size: 18px; font-style: italic; text-shadow: 1px 1px 4px rgba(0,0,0,0.2);">${process.env.SLOGAN}</p>
                        </div>
                    </td>
                </tr>
                
                <!-- Banner section -->
                <tr>
                    <td style="background-color: #D62300; padding: 50px 40px; text-align: center; position: relative;">
                        <h2 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 1px 1px 5px rgba(0,0,0,0.2);">Xác thực Tài khoản của Bạn</h2>
                        <div style="width: 60px; height: 3px; background-color: #FFFFFF; margin: 20px auto; opacity: 0.8; border-radius: 2px;"></div>
                        <p style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 20px; max-width: 450px; display: inline-block; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0,0,0,0.15);">Chỉ còn một bước nữa để thưởng thức ẩm thực tuyệt vời!</p>
                    </td>
                </tr>
                
                <!-- Main Content -->
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
                
                <!-- Footer with solid color instead of gradient (matching the provided example) -->
                <tr>
                    <td style="background-color: #D62300; padding: 40px; text-align: center; position: relative;">
                        <p style="color: #FFFFFF; margin: 0 0 15px 0; font-size: 15px; opacity: 0.9;">© ${new Date().getFullYear()} ${process.env.TRADEMARK_NAME}. Tất cả các quyền được bảo lưu.</p>
                        <a href="${process.env.APP_URL}" style="display: inline-block; color: #FFFFFF; font-weight: 500; text-decoration: none; font-size: 15px; padding: 8px 20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 30px; margin-top: 10px; transition: all 0.3s ease;">Website</a>
                    </td>
                </tr>
            </table>
        </body>
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
}

export class ENGLIS_DYNAMIC_MAIL {
  static welcomeMail(display_name: string) {
    return {
      subject: `Welcome to ${process.env.TRADEMARK_NAME}`,
      html: `
        <body style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
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
        </body>
      `
    }
  }
  static emailVerifyMail(url: string) {
    return {
      subject: `Account Verification - ${process.env.TRADEMARK_NAME}`,
      html: `
        <body style="margin: 0; padding: 0; font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFFFFF; color: #333333; line-height: 1.6;">
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
        </body>
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
}
