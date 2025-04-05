"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"

interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Dữ liệu combo
const comboDeals = [
  {
    id: 1,
    name: "Bữa Tiệc Gia Đình",
    description: "2 Burger, 4 Gà Rán, 2 Khoai Tây Lớn, 4 Nước Uống",
    originalPrice: 459000,
    discountedPrice: 359000,
    image: "/public/images/system/combogiadinh_voucher.jpg?height=200&width=300",
    badge: "Bán Chạy",
    voucherCode: "GIADINH20",
    voucherThreshold: 359000,
  },
  {
    id: 2,
    name: "Combo Burger",
    description: "2 Burger Cao Cấp, 2 Khoai Tây Vừa, 2 Nước Uống",
    originalPrice: 289000,
    discountedPrice: 229000,
    image: "/public/images/system/burgerchay_menu.jpg?height=200&width=300",
    badge: "Phổ Biến",
    voucherCode: "BURGER10",
    voucherThreshold: 229000,
  },
  {
    id: 3,
    name: "Combo Gà Rán",
    description: "6 Miếng Gà Rán, 2 Khoai Tây Vừa, 2 Nước Uống",
    originalPrice: 329000,
    discountedPrice: 269000,
    image: "/public/images/system/canhgacay_menu.jpg?height=200&width=300",
    badge: "Giá Sốc",
    voucherCode: "GARAN15",
    voucherThreshold: 269000,
  },
  {
    id: 4,
    name: "Bữa Ăn Đơn",
    description: "1 Burger, 1 Khoai Tây Vừa, 1 Nước Uống",
    originalPrice: 159000,
    discountedPrice: 129000,
    image: "/public/images/system/burgerdacbiet.jpg?height=200&width=300",
    badge: "Nhanh Gọn",
    voucherCode: "DON5",
    voucherThreshold: 129000,
  },
]

// Dữ liệu món ăn phổ biến
const popularItems = [
  {
    id: 1,
    name: "Burger Phô Mai Đôi",
    description: "Hai lớp thịt bò với phô mai đặc biệt",
    price: 99000,
    image: "/public/images/system/burgerphomai_menu.jpg?height=150&width=150",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Gà Rán Cay",
    description: "Gà giòn với sốt cay bí truyền",
    price: 89000,
    image: "/public/images/system/garansotthai.jpg?height=150&width=150",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Khoai Tây Phủ",
    description: "Khoai tây phủ phô mai, thịt xông khói và ớt jalapeno",
    price: 69000,
    image: "/public/images/system/khoaitaychien_menu.jpg?height=150&width=150",
    rating: 4.6,
  },
  {
    id: 4,
    name: "Milkshake Sô-cô-la",
    description: "Milkshake sô-cô-la đậm đà và béo ngậy",
    price: 49000,
    image: "/public/images/system/sualac_menu.jpg?height=150&width=150",
    rating: 4.9,
  },
]

const SealPage: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("weekday")

  useEffect(() => {
    AOS.init({
      duration: 1100,
      once: false,
      mirror: true,
      offset: 100
    })
  }, [])

  useEffect(() => {
    AOS.refresh()
  }, [activeTab])

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Phần Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 opacity-90"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="opacity-0 translate-y-4" data-aos="fade-up" data-aos-duration="500">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">Khuyến Mãi Cực Sốc!</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Nhanh tay đặt ngay để thưởng thức những ưu đãi hấp dẫn
            </p>
            <button onClick={() => navigate('/menu')} className="px-6 py-3 cursor-pointer bg-white text-orange-600 hover:bg-orange-100 rounded-md font-medium text-lg flex items-center justify-center mx-auto">
              Đặt Hàng Ngay
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-orange-50 to-transparent"></div>
      </section>

      {/* Phần Combo Deals */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Combo Khuyến Mãi Hấp Dẫn</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tiết kiệm hơn với các combo giá trị. Hoàn hảo để chia sẻ cùng gia đình và bạn bè!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {comboDeals.map((combo) => (
            <div
              key={combo.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay={combo.id * 100}
            >
              <div className="relative">
                <img src={combo.image || "/placeholder.svg"} alt={combo.name} className="w-full h-48 object-cover" />
                <span className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {combo.badge}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-xl mb-1">{combo.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{combo.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg text-gray-500 line-through">{formatCurrency(combo.originalPrice)}</span>
                  <span className="text-2xl font-bold text-orange-600">{formatCurrency(combo.discountedPrice)}</span>
                  <span className="ml-auto text-xs font-medium text-green-600 border border-green-600 rounded px-2 py-1">
                    Tiết kiệm {formatCurrency(combo.originalPrice - combo.discountedPrice)}
                  </span>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center text-amber-800 mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    </svg>
                    <span className="text-sm font-medium">
                      Chi tiêu {formatCurrency(combo.voucherThreshold)} để nhận:
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="bg-white px-3 py-1 rounded border border-amber-200 font-mono text-amber-900">
                      {combo.voucherCode}
                    </code>
                    <button
                      onClick={() => copyVoucherCode(combo.voucherCode)}
                      className="text-amber-800 hover:text-amber-900 hover:bg-amber-100 px-3 py-1 rounded text-sm"
                    >
                      {copiedCode === combo.voucherCode ? "Đã sao chép!" : "Sao chép"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-medium">
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Phần Món Ăn Phổ Biến */}
      <section className="bg-gradient-to-br from-amber-600 to-orange-500 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Món Ăn Yêu Thích</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Những món ăn được yêu thích nhất khiến khách hàng luôn quay lại
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
                data-aos="zoom-in"
                data-aos-delay={item.id * 100}
              >
                <div className="p-4 flex items-center justify-center">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-32 w-32 object-cover rounded-full"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-yellow-500 fill-yellow-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="ml-1 text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">{formatCurrency(item.price)}</span>
                    <button className="border border-orange-600 text-orange-600 hover:bg-orange-50 px-3 py-1 rounded text-sm">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phần Ưu Đãi Đặc Biệt */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ưu Đãi Đặc Biệt</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Những ưu đãi có thời hạn bạn không nên bỏ lỡ</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex border-b mb-8">
            <button
              className={`px-4 py-2 font-medium text-center flex-1 ${activeTab === "weekday" ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("weekday")}
            >
              Ưu Đãi Ngày Thường
            </button>
            <button
              className={`px-4 py-2 font-medium text-center flex-1 ${activeTab === "weekend" ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("weekend")}
            >
              Ưu Đãi Cuối Tuần
            </button>
            <button
              className={`px-4 py-2 font-medium text-center flex-1 ${activeTab === "student" ? "border-b-2 border-orange-600 text-orange-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("student")}
            >
              Ưu Đãi Học Sinh
            </button>
          </div>

          <div className={`${activeTab === "weekday" ? "block" : "hidden"}`} data-aos="fade-right">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5 text-orange-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <h3 className="font-bold text-xl">Ưu Đãi Bữa Trưa Ngày Thường</h3>
                </div>
                <p className="text-gray-600 text-sm">Áp dụng từ Thứ Hai đến Thứ Sáu, 11:00 - 15:00</p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Combo Burger & Khoai Tây</h4>
                      <p className="text-sm text-gray-600">Burger thường với khoai tây vừa</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-orange-600">89.000₫</span>
                      <p className="text-xs text-gray-500">Tiết kiệm 30.000₫</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Bữa Ăn Gà 2 Miếng</h4>
                      <p className="text-sm text-gray-600">2 miếng gà với salad bắp cải và bánh mì</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-orange-600">79.000₫</span>
                      <p className="text-xs text-gray-500">Tiết kiệm 25.000₫</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t">
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-medium">
                  Xem Tất Cả Ưu Đãi Ngày Thường
                </button>
              </div>
            </div>
          </div>

          <div className={`${activeTab === "weekend" ? "block" : "hidden"}`} data-aos="fade-right">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5 text-orange-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <h3 className="font-bold text-xl">Ưu Đãi Gia Đình Cuối Tuần</h3>
                </div>
                <p className="text-gray-600 text-sm">Áp dụng Thứ Bảy và Chủ Nhật, Cả Ngày</p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Hộp Gia Đình</h4>
                      <p className="text-sm text-gray-600">4 burger, 4 khoai tây, 4 nước uống</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-orange-600">299.000₫</span>
                      <p className="text-xs text-gray-500">Tiết kiệm 80.000₫</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Gói Tiệc Gà</h4>
                      <p className="text-sm text-gray-600">12 miếng gà, 3 món phụ cỡ lớn</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-orange-600">329.000₫</span>
                      <p className="text-xs text-gray-500">Tiết kiệm 70.000₫</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t">
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-medium">
                  Xem Tất Cả Ưu Đãi Cuối Tuần
                </button>
              </div>
            </div>
          </div>

          <div className={`${activeTab === "student" ? "block" : "hidden"}`} data-aos="fade-right">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5 text-orange-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <h3 className="font-bold text-xl">Ưu Đãi Học Sinh, Sinh Viên</h3>
                </div>
                <p className="text-gray-600 text-sm">Áp dụng với thẻ học sinh, sinh viên, mọi ngày</p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Bữa Ăn Học Sinh</h4>
                      <p className="text-sm text-gray-600">Burger, khoai tây và nước uống</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-orange-600">69.000₫</span>
                      <p className="text-xs text-gray-500">Tiết kiệm 40.000₫</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Gói Nhóm Học Tập</h4>
                      <p className="text-sm text-gray-600">4 burger, 2 khoai tây lớn, 4 nước uống</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-orange-600">249.000₫</span>
                      <p className="text-xs text-gray-500">Tiết kiệm 60.000₫</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t">
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-medium">
                  Xem Tất Cả Ưu Đãi Học Sinh
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phần Hướng Dẫn Sử Dụng Voucher */}
      <section className="bg-gradient-to-br from-amber-100 to-orange-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cách Sử Dụng Voucher</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Làm theo các bước đơn giản để tận hưởng ưu đãi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-orange-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Bước 1</h3>
              <p className="text-gray-600">Thêm món ăn yêu thích vào giỏ hàng và đạt mức chi tiêu tối thiểu</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-orange-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Bước 2</h3>
              <p className="text-gray-600">Nhập mã voucher tại ô mã khuyến mãi khi thanh toán</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center" data-aos="fade-up" data-aos-delay="300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-orange-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Bước 3</h3>
              <p className="text-gray-600">Tận hưởng bữa ăn ngon với mức giá tiết kiệm!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Thời Gian Có Hạn */}
      <section className="container mx-auto px-4 py-8">
        <div
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white relative overflow-hidden"
          data-aos="fade-up"
        >
          <div className="absolute top-0 right-0 w-40 h-40 -mt-10 -mr-10 bg-yellow-500 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 -mb-6 -ml-6 bg-yellow-500 rounded-full opacity-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <h3 className="text-xl font-bold">Ưu Đãi Có Thời Hạn!</h3>
              </div>
              <p className="mt-2">Các khuyến mãi sẽ kết thúc sớm. Đặt hàng ngay trước khi hết hạn!</p>
            </div>
            <button onClick={() => navigate('/menu')} className="bg-white cursor-pointer text-orange-600 hover:bg-orange-100 px-6 py-3 rounded-md font-medium text-lg">
              Đặt Hàng Ngay
            </button>
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
              Thưởng thức những món ăn ngon nhất với dịch vụ giao hàng nhanh chóng và tiện lợi!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" data-aos="fade-up" data-aos-delay="300">
              <input
                type="email"
                placeholder="Địa Chỉ Email Của Bạn"
                className="flex-grow px-4 py-3 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
              />
              <button onClick={() => navigate('/menu')} className="bg-white cursor-pointer text-orange-600 hover:bg-yellow-50 px-6 py-3 rounded-md font-bold shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                Đặt Hàng Ngay
              </button>
            </div>

            <div className="mt-8 flex justify-center gap-6" data-aos="fade-up" data-aos-delay="500">
              {["Burger", "Gà Rán", "Pizza", "Đồ Uống"].map((item, index) => (
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

export default SealPage

