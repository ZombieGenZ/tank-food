// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { JSX, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; 
import { useNavigate } from "react-router-dom"

const Aboutus = (): JSX.Element => {
  const navigate = useNavigate()
  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }
  useEffect(() => {
    AOS.init({
      duration: 1500, 
      once: false, 
      mirror: true, 
      offset: 100
    });
  }, []);

  return (
    <div className="w-full bg-white font-sans">
    <section className="relative overflow-hidden bg-gradient-to-r from-yellow-100 to-yellow-50 py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 z-10" data-aos="fade-right" data-aos-delay="100">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                    {language() == "Tiếng Việt" ? "Chào mừng đến với" : "Welcome to"}
                    <br/>
                    <span className="text-red-600" data-aos="zoom-in" data-aos-delay="400">TankFood's Việt Nam</span>
                </h1>
                <p className="text-4x1 text-gray-700 mb-8" data-aos="fade-up" data-aos-delay="300">
                    {language() == "Tiếng Việt"
                        ? "TankFood là chuỗi nhà hàng thức ăn nhanh tiện lợi, phục vụ hơn 100 khách hàng mỗi ngày với hơn 21 nhà hàng."
                        : "TankFood is a convenient fast-food restaurant chain, serving over 100 customers daily with more than 21 restaurants."}
                </p>
                <div className="flex space-x-4" data-aos="fade-up" data-aos-delay="500">
                    <button className="bg-red-600 text-white font-medium py-3 px-6 rounded-full shadow-lg transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-red-700 hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
                        {language() == "Tiếng Việt" ? "Tìm hiểu thêm" : "Learn More"}
                    </button>
                    <button onClick={() => navigate('/menu')} className="bg-white cursor-pointer text-red-600 font-medium py-3 px-6 rounded-full shadow-lg transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-gray-100 hover:-translate-y-1 hover:scale-105 hover:shadow-xl border border-red-600">
                        {language() == "Tiếng Việt" ? "Xem Thực Đơn" : "View Menu"}
                    </button>
                </div>
            </div>
            <div className="md:w-1/2 relative" data-aos="fade-left" data-aos-delay="300">
                <div className="overflow-hidden rounded-lg group">
                    <img
                        src="/images/system/logo tank food.png"
                        alt="TankFood's Logo"
                        className="w-full h-auto relative z-10 transform transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                </div>
                <div className="absolute -right-10 -bottom-10 w-30 h-30 bg-yellow-400 rounded-full opacity-50 z-0 animate-pulse" data-aos="zoom-in" data-aos-delay="600"></div>
                <div className="absolute -left-5 -top-5 w-20 h-20 bg-red-500 rounded-full opacity-30 z-0 animate-pulse" data-aos="zoom-in" data-aos-delay="800"></div>
            </div>
        </div>
    </section>

    <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12" data-aos="fade-up">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{language() == "Tiếng Việt" ? "Về Chúng Tôi" : "About Us"}</h2>
                <div className="w-20 h-1 bg-yellow-500 mx-auto mb-6" data-aos="width" data-aos-delay="300"></div>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="400">
                    {language() == "Tiếng Việt"
                        ? "TankFood's tự hào mang đến những trải nghiệm ẩm thực tuyệt vời với tiêu chuẩn chất lượng tại Việt Nam."
                        : "TankFood's is proud to bring wonderful culinary experiences with quality standards in Vietnam."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div
                    className="group bg-white p-6 rounded-lg border border-gray-100 transform perspective-1000 transition-all duration-500"
                    data-aos="zoom-in-down"
                    data-aos-delay="500"
                >
                    <div className="transform transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:shadow-xl rounded-lg p-4">
                        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto transform transition-transform duration-500 ease-out group-hover:scale-110">
                            <img src="/images/system/icon-like.png" alt={language() == "Tiếng Việt" ? "Chất lượng" : "Quality"} className="w-12 h-12"/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{language() == "Tiếng Việt" ? "Chất Lượng" : "Quality"}</h3>
                        <p className="text-gray-600 text-center">
                            {language() == "Tiếng Việt"
                                ? "Chúng tôi luôn đảm bảo các tiêu chuẩn cao nhất về chất lượng, an toàn thực phẩm và dịch vụ."
                                : "We always ensure the highest standards of quality, food safety and service."}
                        </p>
                    </div>
                </div>

                <div
                    className="group bg-white p-6 rounded-lg border border-gray-100 transform perspective-1000 transition-all duration-500"
                    data-aos="zoom-in-down"
                    data-aos-delay="600"
                >
                    <div className="transform transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:shadow-xl rounded-lg p-4">
                        <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto transform transition-transform duration-500 ease-out group-hover:scale-110">
                            <img src="/images/system/icon-dish.png" alt={language() == "Tiếng Việt" ? "Đa dạng" : "Variety"} className="w-12 h-12"/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{language() == "Tiếng Việt" ? "Đa Dạng" : "Variety"}</h3>
                        <p className="text-gray-600 text-center">
                            {language() == "Tiếng Việt"
                                ? "Thực đơn phong phú, đa dạng với nhiều lựa chọn phù hợp với khẩu vị của người Việt Nam."
                                : "Rich and diverse menu with many options to suit the Vietnamese taste."}
                        </p>
                    </div>
                </div>

                <div
                    className="group bg-white p-6 rounded-lg border border-gray-100 transform perspective-1000 transition-all duration-500"
                    data-aos="zoom-in-down"
                    data-aos-delay="700"
                >
                    <div className="transform transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:shadow-xl rounded-lg p-4">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto transform transition-transform duration-500 ease-out group-hover:scale-110">
                            <img src="/images/system/icon-world.png" alt={language() == "Tiếng Việt" ? "Toàn cầu" : "Global"} className="w-12 h-12"/>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{language() == "Tiếng Việt" ? "Toàn Cầu" : "Global"}</h3>
                        <p className="text-gray-600 text-center">
                            {language() == "Tiếng Việt"
                                ? "Là một phần của thương hiệu toàn cầu với hơn 100 năm kinh nghiệm phục vụ khách hàng."
                                : "Being a part of a global brand with over 100 years of customer service experience."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10" data-aos="fade-right" data-aos-duration="1200">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                        {language() == "Tiếng Việt" ? "Lịch Sử Phát Triển" : "History of Development"}
                    </h2>
                    <div className="w-20 h-1 bg-yellow-500 mb-6" data-aos="width" data-aos-delay="200"></div>
                    <p className="text-lg text-gray-600 mb-6" data-aos="fade-up" data-aos-delay="300">
                        {language() == "Tiếng Việt"
                            ? "TankFood's được thành lập bởi bốn anh em Thái, Khoa, Đức Anh và Nam vào năm 2025. Ngày nay, TankFood's đã trở thành thương hiệu thức ăn nhanh hàng đầu thế giới với hàng nghìn nhà hàng trên toàn cầu."
                            : "TankFood's was founded by four brothers Thai, Khoa, Duc Anh, and Nam in 2025. Today, TankFood's has become the world's leading fast-food brand with thousands of restaurants worldwide."}
                    </p>
                    <p className="text-lg text-gray-600 mb-6" data-aos="fade-up" data-aos-delay="400">
                        {language() == "Tiếng Việt"
                            ? "Tại Việt Nam, TankFood's chính thức có mặt, thương hiệu đã nhanh chóng được đón nhận nồng nhiệt bởi người tiêu dùng Việt Nam."
                            : "In Vietnam, TankFood's officially made its presence, and the brand was quickly and warmly welcomed by Vietnamese consumers."}
                    </p>
                    <button
                        className="relative bg-red-600 text-white font-medium py-3 px-6 rounded-full overflow-hidden shadow-lg group"
                        data-aos="zoom-in"
                        data-aos-delay="500"
                    >
                        <span className="relative z-10 transition-transform duration-500 ease-out group-hover:-translate-y-1 inline-block">
                            {language() == "Tiếng Việt" ? "Tìm hiểu thêm về lịch sử" : "Learn more about the history"}
                        </span>
                        <span className="absolute inset-0 bg-red-700 transform scale-x-0 origin-left transition-transform duration-400 ease-out group-hover:scale-x-100"></span>
                    </button>
                </div>
                <div className="md:w-1/2 relative" data-aos="fade-left" data-aos-delay="300" data-aos-duration="1200">
                    <div className="w-120 h-140 overflow-hidden rounded-lg shadow-xl transform transition duration-500 hover:shadow-2xl">
                        <img
                            src="/images/system/quanan_aboutus.jpg"
                            alt={language() == "Tiếng Việt" ? "Lịch sử TankFood's" : "TankFood's History"}
                            className="w-full h-auto transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-110"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
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
  );
};

export default Aboutus;