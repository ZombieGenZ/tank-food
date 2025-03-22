import { JSX } from "react";

const Aboutus = (): JSX.Element => {
  return (
    <div className="w-full bg-white font-sans">
      <section className="relative overflow-hidden bg-gradient-to-r from-yellow-100 to-yellow-50 py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Chào mừng đến với
              <br/>
              <span className="text-red-600">TankFood's Việt Nam</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              TankFood là chuỗi nhà hàng thức ăn nhanh tiện lợi, phục vụ hơn 100 khách
              hàng mỗi ngày với hơn 21 nhà hàng.
            </p>
            <div className="flex space-x-4">
              <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                Tìm hiểu thêm
              </button>
              <button className="bg-white hover:bg-gray-100 text-red-600 font-medium py-3 px-6 rounded-full shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 border border-red-600">
                Xem Thực Đơn
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <img
              src="/images/system/logo tank food.png"
              alt="McDonald's Products"
              className="w-full h-auto rounded-lg shadow-xl transform hover:scale-105 transition-all duration-500 z-10 relative"
            />
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-400 rounded-full opacity-50 z-0 animate-pulse"></div>
            <div className="absolute -left-5 -top-5 w-20 h-20 bg-red-500 rounded-full opacity-30 z-0 animate-pulse"></div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Về Chúng Tôi</h2>
            <div className="w-20 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              McDonald's tự hào mang đến những trải nghiệm ẩm thực tuyệt vời với tiêu chuẩn chất lượng
              toàn cầu tại Việt Nam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="material-symbols-outlined text-red-600 text-3xl">thumb_up</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Chất Lượng</h3>
              <p className="text-gray-600 text-center">
                Chúng tôi luôn đảm bảo các tiêu chuẩn cao nhất về chất lượng, an toàn thực phẩm và
                dịch vụ.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="material-symbols-outlined text-yellow-600 text-3xl">
                  restaurant
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Đa Dạng</h3>
              <p className="text-gray-600 text-center">
                Thực đơn phong phú, đa dạng với nhiều lựa chọn phù hợp với khẩu vị của người Việt
                Nam.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="material-symbols-outlined text-green-600 text-3xl">public</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Toàn Cầu</h3>
              <p className="text-gray-600 text-center">
                Là một phần của thương hiệu toàn cầu với hơn 70 năm kinh nghiệm phục vụ khách hàng.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Lịch Sử Phát Triển
              </h2>
              <div className="w-20 h-1 bg-yellow-500 mb-6"></div>
              <p className="text-lg text-gray-600 mb-6">
                McDonald's được thành lập bởi hai anh em Richard và Maurice McDonald vào năm 1940.
                Ngày nay, McDonald's đã trở thành thương hiệu thức ăn nhanh hàng đầu thế giới với
                hàng nghìn nhà hàng trên toàn cầu.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Tại Việt Nam, McDonald's chính thức có mặt vào năm 2014 và nhanh chóng được đón nhận
                nồng nhiệt bởi người tiêu dùng Việt Nam.
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                Tìm hiểu thêm về lịch sử
              </button>
            </div>
            <div className="md:w-1/2 relative">
              <img
                src="/images/system/logo tank food.png"
                alt="McDonald's History"
                className="w-full h-auto rounded-lg shadow-xl transform hover:scale-105 transition-all duration-500"
              />
              <div className="absolute -right-4 -bottom-4 w-full h-full border-4 border-yellow-400 rounded-lg -z-10 transform translate-x-4 translate-y-4"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Aboutus;