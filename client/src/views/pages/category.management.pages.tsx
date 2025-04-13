"use client"

import AOS from "aos"
import "aos/dist/aos.css"
import { type JSX, useState, useEffect } from "react"
import { ChevronUp, Plus, Utensils } from "lucide-react"
import { useNavigate } from "react-router-dom"
// import { message } from 'antd';

interface MenuItem {
  key: string
  id: string
  name: string
  description: string
  price: number
  image: string
  tag: string | null
  discount: number
  priceAfterdiscount: number
}

interface MenuCategory {
  key: string
  id: string
  name: string
  items: MenuItem[]
  hasProduct: boolean
}
//Giữ nguyên
interface CategoryItem {
  category_name_translate_1: string
  category_name_translate_2: string
  created_at: string
  index: number
  translate_1_language: string
  translate_2_language: string
  updated_at: string
  _id: string
}

interface Product {
  _id: string
  availability: boolean
  categories: {
    _id: string
    category_name_translate_1: string
    category_name_translate_2: string
    created_at: string
    updated_at: string
    index: number
    translate_1_language: string
    translate_2_language: string
  }
  created_at: string
  created_by: string
  discount: number
  description_translate_1: string
  description_translate_1_language: string
  description_translate_2: string
  description_translate_2_language: string
  preview: {
    path: string
    size: number
    type: string
    url: string
  }
  price: number
  tag_translate_1: string
  tag_translate_1_language: string
  tag_translate_2: string
  tag_translate_2_language: string
  title_translate_1: string
  title_translate_1_language: string
  title_translate_2: string
  title_translate_2_language: string
  updated_at: string
  updated_by: string
}

interface CartItem {
  id: string
  quantity: number
  name: string
  price: number
  image: string
  priceAfterdiscount: number
  discount: number
}

interface CategoryProps {
  addToCart: (item: {
    id: string
    name: string
    price: number
    image: string
    priceAfterdiscount: number
    discount: number
  }) => void
  cart: CartItem[] // Thêm cart vào props
}

const Menu = ({ addToCart, cart }: CategoryProps): JSX.Element => {
  // const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  // const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
  // const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate()
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>(["burger"])

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

  useEffect(() => {
    AOS.init({
      duration: 1300,
      offset: 100,
      once: false,
      mirror: true,
    })
  }, [])

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const language = (): string => {
    const SaveedLanguage = localStorage.getItem("language")
    return SaveedLanguage ? JSON.parse(SaveedLanguage) : "Tiếng Việt"
  }
  const [product, setProduct] = useState<Product[]>([])
  const [category, setCategory] = useState<CategoryItem[]>([])
  const [showProduct, setShowProduct] = useState<MenuCategory[]>([])

  useEffect(() => {
    const newData: MenuCategory[] = category.map((categorys, index) => {
      const newProduct: MenuItem[] = product
        .filter((p) => p.categories?._id === categorys?._id)
        .map((p, idx) => ({
          key: String(idx + 1),
          id: p._id,
          name: language() === "Tiếng Việt" ? p.title_translate_1 : p.title_translate_2,
          description: language() === "Tiếng Việt" ? p.description_translate_1 : p.description_translate_2,
          price: p.price,
          image: p.preview.url,
          tag: language() === "Tiếng Việt" ? p.tag_translate_1 : p.tag_translate_2,
          discount: p.discount,
          priceAfterdiscount: p.price - (p.price * p.discount) / 100,
        }))
      return {
        key: String(index + 1),
        id: categorys._id,
        name: language() == "Tiếng Việt" ? categorys.category_name_translate_1 : categorys.category_name_translate_2,
        items: newProduct,
        hasProduct: newProduct.length > 0,
      }
    })
    setShowProduct(newData)
  }, [product, category])

  useEffect(() => {
    console.log("Show cart: ", cart)
  }, [cart])
  // Hardcoded categories data to match the second code

  useEffect(() => {
    const fetchData = async () => {
      const body = { language: null }

      const productRes = await fetch(`${import.meta.env.VITE_API_URL}/api/products/get-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const productData = await productRes.json()

      const categoryRes = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/get-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const categoryData = await categoryRes.json()

      setProduct(productData.products || []) // Nếu dữ liệu null thì gán []
      setCategory(categoryData.categories || [])
    }

    fetchData()
  }, [])

  // const ortherProduct = product.filter(products => products.categories._id == null)

  function formatCurrency(amount: number, currencyCode = "vi-VN", currency = "VND") {
    const formatter = new Intl.NumberFormat(currencyCode, {
      style: "currency",
      currency: currency,
    })
    return formatter.format(amount)
  }

  return (
    // Header
    <div className="min-h-screen bg-gray-50">
      {/* {contextHolder} */}
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-white to-gray-50">
        {/* Main content */}
        <div className="container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32 relative z-10">
          <div className="flex justify-center mb-8" data-aos="zoom-in-up">
            <img
              src="/images/system/logo tank food.png?height=100&width=300"
              alt="TankFood logo"
              width={300}
              height={100}
              className="object-contain"
            />
          </div>

          <div className="text-center text-gray-700 mb-6" data-aos="zoom-out-up">
            <p className="text-xl md:text-2xl font-san">Nấu, Khuấy và Sẵn Sàng để Phục Vụ</p>
          </div>

          <div className="text-center" data-aos="zoom-out-up">
            <h1
              className="text-7xl md:text-9xl lg:text-[10rem] font-extrabold tracking-wider drop-shadow-lg"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#333",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              TANKFOOD
            </h1>
          </div>

          <div className="flex justify-center mt-12">
            <div className="max-w-2xl text-center" data-aos="fade-up">
              <p className="text-lg text-gray-600 mb-6">
                Khám phá thực đơn đa dạng với các món ăn được chế biến từ nguyên liệu tươi ngon. Đặt hàng ngay hôm nay
                để thưởng thức hương vị tuyệt vời!
              </p>
              <button
                onClick={() => navigate("/menu")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300"
              >
                Xem Thực Đơn
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items Section */}
      <section className="relative bg-gray-50 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16" data-aos="fade-down">
            <h2
              className="text-6xl md:text-7xl font-bold mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#333",
                textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              Thực Đơn TankFood
            </h2>
            <div className="h-1 w-32 bg-orange-400 mx-auto"></div>
          </div>

          <div className="space-y-16">
            {showProduct.map((category) => {
              // Kiểm tra xem category có sản phẩm hay không
              if (category.hasProduct) {
                return (
                  <div key={category.id} className="bg-white rounded-xl shadow-lg" data-aos="fade-up">
                    <div
                      className="flex items-center gap-4 p-6 cursor-pointer group border-b border-gray-100"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600">
                        <Utensils className="w-5 h-5" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                        {category.name}
                      </h2>
                      <ChevronUp
                        className={`ml-auto w-6 h-6 text-gray-500 transition-transform duration-300 ${
                          collapsedCategories.includes(category.id) ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {!collapsedCategories.includes(category.id) && (
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {category.items.map((item, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-110 transform hover:-translate-y-1"
                              style={{
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
                              }}
                              data-aos="fade-up"
                              data-aos-delay={index * 50}
                            >
                              <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                                {item.tag && (
                                  <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {item.tag}
                                  </span>
                                )}
                                {item.discount > 0 && (
                                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    -{item.discount}%
                                  </span>
                                )}
                              </div>
                              <div className="p-4">
                                <h3 className="font-bold text-xl mb-2 text-gray-800">{item.name}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                                <div className="flex items-center gap-2 mb-4">
                                  {item.discount > 0 ? (
                                    <>
                                      <span className="text-sm text-gray-500 line-through">
                                        {formatCurrency(item.price)}
                                      </span>
                                      <span className="text-xl font-bold text-gray-800">
                                        {formatCurrency(item.priceAfterdiscount)}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-xl font-bold text-gray-800">
                                      {formatCurrency(item.price)}
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="w-full cursor-pointer flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                                >
                                  <Plus className="w-4 h-4" /> Thêm vào giỏ hàng
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
              // Nếu category không có sản phẩm, không render gì cả (null)
              return null
            })}
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

export default Menu
