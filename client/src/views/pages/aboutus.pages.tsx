import { JSX, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; 

const Aboutus = (): JSX.Element => {
  useEffect(() => {
    AOS.init({
      duration: 1500, 
      once: false, 
      mirror: true, 
    });
  }, []);

  return (
    <div className="w-full bg-white font-sans">
      <section className="relative overflow-hidden bg-gradient-to-r from-yellow-100 to-yellow-50 py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 z-10" data-aos="fade-right" data-aos-delay="100">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Chào mừng đến với
              <br/>
              <span className="text-red-600" data-aos="zoom-in" data-aos-delay="400">TankFood's Việt Nam</span>
            </h1>
            <p className="text-4x1 text-gray-700 mb-8" data-aos="fade-up" data-aos-delay="300">
              TankFood là chuỗi nhà hàng thức ăn nhanh tiện lợi, phục vụ hơn 100 khách
              hàng mỗi ngày với hơn 21 nhà hàng.
            </p>
            <div className="flex space-x-4" data-aos="fade-up" data-aos-delay="500">
              <button className="bg-red-600 text-white font-medium py-3 px-6 rounded-full shadow-lg transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-red-700 hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
                Tìm hiểu thêm
              </button>
              <button className="bg-white text-red-600 font-medium py-3 px-6 rounded-full shadow-lg transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-gray-100 hover:-translate-y-1 hover:scale-105 hover:shadow-xl border border-red-600">
                Xem Thực Đơn
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative" data-aos="fade-left" data-aos-delay="300">
            <div className="overflow-hidden rounded-lg shadow-xl group">
              <img
                src="/images/system/logo tank food.png"
                alt="McDonald's Products"
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Về Chúng Tôi</h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto mb-6" data-aos="width" data-aos-delay="300"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="400">
              TankFood's tự hào mang đến những trải nghiệm ẩm thực tuyệt vời với tiêu chuẩn chất lượng
              tại Việt Nam.
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
                  <img src="/public/images/system/icon-like.png" alt="Chất lượng" className="w-12 h-12"/>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Chất Lượng</h3>
                <p className="text-gray-600 text-center">
                  Chúng tôi luôn đảm bảo các tiêu chuẩn cao nhất về chất lượng, an toàn thực phẩm và
                  dịch vụ.
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
                  <img src="/public/images/system/icon-dish.png" alt="Đa dạng" className="w-12 h-12"/>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Đa Dạng</h3>
                <p className="text-gray-600 text-center">
                  Thực đơn phong phú, đa dạng với nhiều lựa chọn phù hợp với khẩu vị của người Việt
                  Nam.
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
                  <img src="/public/images/system/icon-world.png" alt="Toàn cầu" className="w-12 h-12"/>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Toàn Cầu</h3>
                <p className="text-gray-600 text-center">
                  Là một phần của thương hiệu toàn cầu với hơn 100 năm kinh nghiệm phục vụ khách hàng.
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
                Lịch Sử Phát Triển
              </h2>
              <div className="w-20 h-1 bg-yellow-500 mb-6" data-aos="width" data-aos-delay="200"></div>
              <p className="text-lg text-gray-600 mb-6" data-aos="fade-up" data-aos-delay="300">
                TankFood's được thành lập bởi bốn anh em Thái, Khoa, Đức Anh và Nam vào năm 2025.
                Ngày nay, TankFood's đã trở thành thương hiệu thức ăn nhanh hàng đầu thế giới với
                hàng nghìn nhà hàng trên toàn cầu.
              </p>
              <p className="text-lg text-gray-600 mb-6" data-aos="fade-up" data-aos-delay="400">
                Tại Việt Nam, TankFood's chính thức có mặt, thương hiệu đã nhanh chóng được đón nhận
                nồng nhiệt bởi người tiêu dùng Việt Nam.
              </p>
              <button 
                className="relative bg-red-600 text-white font-medium py-3 px-6 rounded-full overflow-hidden shadow-lg group"
                data-aos="zoom-in"
                data-aos-delay="500"
              >
                <span className="relative z-10 transition-transform duration-500 ease-out group-hover:-translate-y-1 inline-block">
                  Tìm hiểu thêm về lịch sử
                </span>
                <span className="absolute inset-0 bg-red-700 transform scale-x-0 origin-left transition-transform duration-400 ease-out group-hover:scale-x-100"></span>
              </button>
            </div>
            <div className="md:w-1/2 relative" data-aos="fade-left" data-aos-delay="300" data-aos-duration="1200">
              <div className="w-120 h-140 overflow-hidden rounded-lg shadow-xl transform transition duration-500 hover:shadow-2xl">
                <img
                  src="/public/images/system/quanan_aboutus.jpg"
                  alt="McDonald's History"
                  className="w-full h-auto transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Aboutus;