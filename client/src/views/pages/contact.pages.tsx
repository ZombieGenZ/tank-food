"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"
import { useNavigate } from "react-router-dom"
import { message } from "antd"
// import Verify from "../components/VerifyToken.components"
import { RESPONSE_CODE } from "../../constants/responseCode.constants"

interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContactPage: React.FC<Props> = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
  // const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  // const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token")); 
  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     setRefreshToken(localStorage.getItem("refresh_token"));
  //     setAccessToken(localStorage.getItem("access_token"));
  //   };
            
  //   window.addEventListener("storage", handleStorageChange);
            
  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const language = (): string => {
    const SaveedLanguage = localStorage.getItem('language')
    return SaveedLanguage ? JSON.parse(SaveedLanguage) : "Tiếng Việt"
  }

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: true
    })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // const toastElement = document.createElement("div")
    // console.log("Form submitted:", formData)
    try {
      props.setLoading(true)
      const body = {
        language: null,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        title: formData.subject,
        content: formData.message,
      }

      fetch(`${import.meta.env.VITE_API_URL}/api/contact/send`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      }).then((response) => {
        return response.json()
      }).then((data) => {
        console.log(data)
        if(data.code == RESPONSE_CODE.SEND_CONTACT_FAILED) {
          messageApi.error(data.message)
          // toastElement.className = "fixed top-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg z-50"
          // toastElement.innerHTML = `
          //   <div class="font-bold">Gửi tin nhắn thất bại !</div>
          // `
          // document.body.appendChild(toastElement)
          return
        }
        if(data.code == RESPONSE_CODE.SEND_CONTACT_SUCCESSFUL) {
          // toastElement.className = "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg z-50"
          // toastElement.innerHTML = `
          //   <div class="font-bold">Đã Gửi Tin Nhắn!</div>
          //   <div>Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.</div>
          // `
          // document.body.appendChild(toastElement)
          messageApi.success("Đã Gửi Tin Nhắn .Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất")
        }
      })
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: String(error),
        style: {
          marginTop: '10vh',
        },
      })
      return;
    } finally {
      setTimeout(() => {
        props.setLoading(false)
        // toastElement.remove()
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      }, 2000)
    } 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {contextHolder}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-90"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{language() == "Tiếng Việt" ? "Liên Hệ Với Chúng Tôi" : "Contact Us"}</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {language() == "Tiếng Việt"
                ? "Chúng tôi rất mong được nghe từ bạn! Cho dù bạn có câu hỏi về thực đơn, giao hàng, hay bất cứ điều gì khác, đội ngũ của chúng tôi luôn sẵn sàng trả lời mọi thắc mắc của bạn."
                : "We'd love to hear from you! Whether you have questions about our menu, delivery, or anything else, our team is ready to help."}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20 relative z-10">
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center text-center transform transition-transform hover:scale-105"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{language() == "Tiếng Việt" ? "Địa Chỉ" : "Address"}</h3>
              <p className="text-gray-600">🏪 213 Đường Hoàng Tam Kỳ, Biên Hoà, Đồng Nai</p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center text-center transform transition-transform hover:scale-105"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{language() == "Tiếng Việt" ? "Số Điện Thoại" : "Phone Number"}</h3>
              <p className="text-gray-600">📞 1900 1707</p>
              <p className="text-gray-600">📞 1900 2007</p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center text-center transform transition-transform hover:scale-105"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600">📧 Support@tank-food.io.vn</p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center text-center transform transition-transform hover:scale-105"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{language() == "Tiếng Việt" ? "Giờ Làm Việc" : "Working Hours"}</h3>
              <p className="text-gray-600">⌚ {language() == "Tiếng Việt" ? "Thứ Hai - Thứ Sáu: 8h - 22h" : "Monday - Friday: 8 AM - 10 PM"}</p>
              <p className="text-gray-600">⌚ {language() == "Tiếng Việt" ? "Cuối tuần: 10h - 23h" : "Weekend: 10 AM - 11 PM"}</p>
            </div>
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20">
            <div data-aos="fade-right">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">{language() == "Tiếng Việt" ? "Gửi Tin Nhắn Cho Chúng Tôi" : "Send Us a Message"}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder={language() == "Tiếng Việt" ? "Họ Tên Của Bạn" : "Your Name"}
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder={language() == "Tiếng Việt" ? "Email Của Bạn" : "Your Email"}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="phone"
                        placeholder={language() == "Tiếng Việt" ? "Số điện thoại Của Bạn" : "Your Phone Number"}
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="subject"
                        placeholder={language() == "Tiếng Việt" ? "Tiêu Đề" : "Subject"}
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <textarea
                        name="message"
                        placeholder={language() == "Tiếng Việt" ? "Nội Dung Tin Nhắn" : "Message"}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        rows={5}
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-md flex items-center justify-center gap-2 transition-all"
                    >
                      {language() == "Tiếng Việt" ? "Gửi Tin Nhắn" : "Send Message"}
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

             <div data-aos="fade-left">
                <div className="h-full">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Tìm Chúng Tôi</h2>
                <div className="bg-white rounded-lg shadow-xl p-2 h-[400px] overflow-hidden">
                  <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.365439413932!2d106.8773526112549!3d10.93574338917788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174de691f88014f%3A0x9df92e3d33f02d51!2zMTk5IMSQxrDhu51uZyBT4buRIDEsIExvbmcgQsOsbmgsIEJpw6puIEjDsmEsIMSQ4buTbmcgTmFpLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1742962263813!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Restaurant Location"
                  className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{language() == "Tiếng Việt" ? "Câu Hỏi Thường Gặp" : "Frequently Asked Questions"}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {language() == "Tiếng Việt"
              ? "Tìm câu trả lời cho những câu hỏi phổ biến nhất về dịch vụ, giao hàng và các lựa chọn thực đơn của chúng tôi."
              : "Find answers to the most common questions about our services, delivery, and menu options."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{language() == "Tiếng Việt" ? "Bạn có cung cấp dịch vụ giao hàng không?" : "Do you offer delivery service?"}</h3>
            <p className="text-gray-600">
              {language() == "Tiếng Việt"
                ? "Có, chúng tôi cung cấp dịch vụ giao hàng trong phạm vi 5km từ nhà hàng. Đơn hàng có thể được đặt trực tuyến hoặc qua điện thoại."
                : "Yes, we offer delivery service within a 5km radius of our restaurant. Orders can be placed online or by phone."}
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{language() == "Tiếng Việt" ? "Thời gian đông khách nhất là khi nào?" : "What are your busiest hours?"}</h3>
            <p className="text-gray-600">
              {language() == "Tiếng Việt"
                ? "Thời gian đông khách nhất của chúng tôi thường là từ 12h-14h cho bữa trưa và 18h-20h cho bữa tối. Chúng tôi khuyên bạn nên đặt hàng trước trong những khoảng thời gian này."
                : "Our busiest hours are typically from 12 PM to 2 PM for lunch and 6 PM to 8 PM for dinner. We recommend placing your order in advance during these times."}
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{language() == "Tiếng Việt" ? "Bạn có phục vụ cho các sự kiện không?" : "Do you cater for events?"}</h3>
            <p className="text-gray-600">
              {language() == "Tiếng Việt"
                ? "Có, chúng tôi cung cấp dịch vụ ẩm thực cho các sự kiện với mọi quy mô. Vui lòng liên hệ với chúng tôi ít nhất 48 giờ trước để thảo luận về yêu cầu của bạn."
                : "Yes, we offer catering services for events of all sizes. Please contact us at least 48 hours in advance to discuss your requirements."}
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{language() == "Tiếng Việt" ? "Bạn có các lựa chọn cho người ăn chay không?" : "Do you have vegetarian options?"}</h3>
            <p className="text-gray-600">
              {language() == "Tiếng Việt"
                ? "Có, chúng tôi có nhiều lựa chọn ăn chay trong thực đơn. Chúng tôi cũng có thể tùy chỉnh hầu hết các món ăn để phù hợp với sở thích ăn uống của bạn."
                : "Yes, we have a variety of vegetarian options on our menu. We can also customize most dishes to suit your dietary preferences."}
            </p>
          </div>
        </div>
      </div>

      {/* TankFood Highlight Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 py-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 2 + 1}rem`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                            opacity: 0.3,
                        }}
                    >
                        🍔
                    </div>
                ))}
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i + 20}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 2 + 1}rem`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                            opacity: 0.3,
                        }}
                    >
                        🍟
                    </div>
                ))}
            </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
            <div
                className="max-w-3xl mx-auto text-center"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
                data-aos-delay="100"
                data-aos-anchor-placement="top-bottom"
            >
                <div className="mb-8 transform transition-transform duration-700 hover:scale-105">
                    <h2
                        className="text-6xl font-bold mb-2 text-white drop-shadow-lg"
                        style={{
                            textShadow: "0 4px 8px rgba(0,0,0,0.3)",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                    >
                        TankFood
                    </h2>
                    <div className="h-1 w-24 bg-white mx-auto rounded-full"></div>
                </div>

                <p className="text-xl text-white/90 mb-8 drop-shadow-md">
                    {language() == "Tiếng Việt"
                        ? "Thưởng thức những món ăn ngon nhất với dịch vụ giao hàng nhanh chóng và tiện lợi!"
                        : "Enjoy the most delicious dishes with fast and convenient delivery service!"}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" data-aos="fade-up" data-aos-delay="300">
                    <input
                        type="email"
                        placeholder={language() == "Tiếng Việt" ? "Địa Chỉ Email Của Bạn" : "Your Email Address"}
                        className="flex-grow px-4 py-3 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
                    />
                    <button onClick={() => navigate('/menu')} className="bg-white cursor-pointer text-orange-600 hover:bg-yellow-50 px-6 py-3 rounded-md font-bold shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                        {language() == "Tiếng Việt" ? "Đặt Hàng Ngay" : "Order Now"}
                    </button>
                </div>

                <div className="mt-8 flex justify-center gap-6" data-aos="fade-up" data-aos-delay="500">
                    {[language() == "Tiếng Việt" ? "Burger" : "Burger",
                    language() == "Tiếng Việt" ? "Gà Rán" : "Fried Chicken",
                    language() == "Tiếng Việt" ? "Pizza" : "Pizza",
                    language() == "Tiếng Việt" ? "Đồ Uống" : "Drinks"
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium shadow-md hover:bg-white/30 cursor-pointer transition-all"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Animated elements */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <div className="relative h-16">
            <div
              className="absolute bottom-0 left-0 w-[200%] h-16"
              style={{
                background:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23FFFFFF'/%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='%23FFFFFF'/%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='%23FFFFFF'/%3E%3C/svg%3E\")",
                backgroundSize: "100% 100%",
                animation: "wave 15s linear infinite",
              }}
            ></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
      <footer className="py-8 bg-orange-800 text-white">
                <div className="container mx-auto px-4 text-center">
                <p className="font-['Roboto_Slab']">© 2025 TankFood. Đã đăng ký bản quyền.</p>
                </div>
            </footer>
    </div>
  )
}

export default ContactPage