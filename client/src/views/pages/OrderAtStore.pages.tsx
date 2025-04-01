"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Minus, ShoppingCart, X, QrCode, Wallet } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

interface Category {
  category_name_translate_1: string;
  category_name_translate_2: string;
  created_at: string;  // ISO date string
  index: number;
  translate_1_language: string;
  translate_2_language: string;
  updated_at: string;  // ISO date string
  _id: string;
}

interface Product {
  _id: string;
  availability: boolean;
  categories?: Category;
  created_at: string;
  created_by: string;
  description_translate_1: string;
  description_translate_1_language: string;
  description_translate_2: string;
  description_translate_2_language: string;
  preview: {
      path: string;
      size: number;
      type: string;
      url: string;
  };
  discount: number,
  price: number;
  tag_translate_1: string;
  tag_translate_1_language: string;
  tag_translate_2: string;
  tag_translate_2_language: string;
  title_translate_1: string;
  title_translate_1_language: string;
  title_translate_2: string;
  title_translate_2_language: string;
  updated_at: string;
  updated_by: string;
  quantity?: number | null;
}

const OrderAtStore: React.FC = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [Category, setCategory] = useState<Category[]>([]);
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })
  }, [])

  useEffect(() => {
        const body = {
          language: null,
        } 
        fetch(`${import.meta.env.VITE_API_URL}/api/products/get-product`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }).then((response) => {
          return response.json()
        }).then((data) => {
          setProduct(data.products)
        })
  
        fetch(`${import.meta.env.VITE_API_URL}/api/categories/get-category`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }).then((response) => {
          return response.json()
        }).then((data) => {
          setCategory(data.categories)
        })
    }, [])

    useEffect(() => {
      console.log(product)
      console.log(Category)
    }, [product, Category])

  const [activeTab, setActiveTab] = useState<"food" | "drinks">("food")
  const [cart, setCart] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "cash" | null>(null)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [orderId, setOrderId] = useState("")

  useEffect(() => {
    if (isModalOpen) {
      // Generate a random order ID when modal opens
      setOrderId(`DH${Math.floor(1000 + Math.random() * 9000)}`)
    }
  }, [isModalOpen])

  // Simulate payment completion after 5 seconds when in QR mode
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (paymentMethod === "qr" && !paymentCompleted) {
      timer = setTimeout(() => {
        setPaymentCompleted(true)
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [paymentMethod, paymentCompleted])

  // const menuItems: FoodItem[] = [
  //   {
  //     id: "1",
  //     name: "Burger Bò Phô Mai",
  //     price: 45000,
  //     category: "food",
  //     subcategory: "burger",
  //     image: "/placeholder.svg?height=100&width=100",
  //   },
  //   {
  //     id: "4",
  //     name: "Burger Gà Chiên",
  //     price: 40000,
  //     category: "food",
  //     subcategory: "burger",
  //     image: "/placeholder.svg?height=100&width=100",
  //   },
  //   {
  //     id: "5",
  //     name: "Burger Cá Muối Ran",
  //     price: 65000,
  //     category: "food",
  //     subcategory: "burger",
  //     image: "/placeholder.svg?height=100&width=100",
  //   },
  //   {
  //     id: "2",
  //     name: "Khoai Tây Chiên",
  //     price: 25000,
  //     category: "food",
  //     subcategory: "side",
  //     image: "/placeholder.svg?height=100&width=100",
  //   },
  //   {
  //     id: "6",
  //     name: "Gà Rán (3 miếng)",
  //     price: 55000,
  //     category: "food",
  //     subcategory: "side",
  //     image: "/placeholder.svg?height=100&width=100",
  //   },
  //   {
  //     id: "7",
  //     name: "Hot Dog",
  //     price: 20000,
  //     category: "food",
  //     subcategory: "side",
  //     image: "/placeholder.svg?height=100&width=100",
  //   },
  //   { id: "3", name: "COCA-COLA", price: 15000, category: "drinks", image: "/placeholder.svg?height=100&width=100" },
  //   { id: "8", name: "Pepsi", price: 15000, category: "drinks", image: "/placeholder.svg?height=100&width=100" },
  //   { id: "9", name: "Trà Đào", price: 20000, category: "drinks", image: "/placeholder.svg?height=100&width=100" },
  // ]

  const addToCart = (item: Product) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id)

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id ? { ...cartItem, quantity: (cartItem.quantity || 0) + 1 } : cartItem,
        ),
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item._id !== id))
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart(cart.map((item) => (item._id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 0), 0)
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}đ`
  }

  const openModal = () => {
    setIsModalOpen(true)
    setPaymentMethod(null)
    setPaymentCompleted(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setPaymentMethod(null)
    setPaymentCompleted(false)
  }

  const handleOrderComplete = () => {
    closeModal()
    // Here you would typically handle order completion logic
    // For example, clearing the cart or redirecting to a confirmation page
    setCart([])
  }


  const burgerItems = product.filter((item) => item.categories?.category_name_translate_1 === Category[0]?.category_name_translate_1)
  const sideItems = product.filter((item) => item.categories?.category_name_translate_1 === Category[1]?.category_name_translate_1)
  const drinkItems = product.filter((item) => item.categories?.category_name_translate_1 === Category[2]?.category_name_translate_1)

  useEffect(() => {
    console.log(burgerItems)
    console.log(sideItems)
    console.log(drinkItems)
  }, [burgerItems, sideItems, drinkItems])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto" data-aos="fade-up" data-aos-delay="100">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Order At Store
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Section */}
          <div
            className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 h-fit"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Danh sách đồ ăn đã chọn</h2>

            <div className="space-y-4 mb-6">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Giỏ hàng trống</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border-b pb-3"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div>
                      <p className="font-medium">{item.title_translate_1}</p>
                      <p className="text-gray-600">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item._id, (item.quantity || 0) - 1)}
                        className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, (item.quantity || 0) + 1)}
                        className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Tổng tiền:</span>
                <span className="text-lg font-bold">{formatPrice(calculateTotal())}</span>
              </div>

              <button
                className="relative w-full py-3 bg-green-500 text-white rounded-lg font-medium overflow-hidden group transition-all duration-300 ease-out hover:bg-green-600 active:scale-95"
                data-aos="zoom-in"
                data-aos-delay="400"
                onClick={openModal}
              >
                <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 group-hover:scale-100 group-hover:bg-green-600/30 rounded-lg"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <span className="inline-block transition-all duration-500 group-hover:scale-125 group-hover:font-bold group-hover:text-yellow-100 group-hover:drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]">
                    Đặt ngay
                  </span>
                  <ShoppingCart className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                </div>
              </button>
            </div>
          </div>

          {/* Menu Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6" data-aos="fade-left" data-aos-delay="300">
            <h2 className="text-xl font-bold mb-4">Tank Food's menu</h2>

            {/* Tabs */}
            <div className="flex border-b mb-6">
              <button
                className={`pb-2 px-4 font-medium transition-all ${
                  activeTab === "food" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("food")}
              >
                Đồ ăn
              </button>
              <button
                className={`pb-2 px-4 font-medium transition-all ${
                  activeTab === "drinks"
                    ? "text-red-500 border-b-2 border-red-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("drinks")}
              >
                Đồ uống
              </button>
            </div>

            {activeTab === "food" && (
              <>
                {/* Burgers */}
                <div data-aos="fade-up" data-aos-delay="400">
                  <h3 className="text-lg font-bold mb-4">Burger</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {burgerItems.map((item) => (
                      <div
                        key={item._id}
                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
                        onClick={() => addToCart(item)}
                        data-aos="zoom-in"
                        data-aos-delay={400 + Number.parseInt(item._id) * 50}
                      >
                        <div className="h-32 bg-gray-100 flex items-center justify-center">
                          <img
                            src={item.preview.url || "/placeholder.svg"}
                            alt={item.title_translate_1}
                            className="h-24 w-24 object-cover"
                          />
                        </div>
                        <div className="p-3 text-center">
                          <h4 className="font-medium">{item.title_translate_1}</h4>
                          <p className="text-red-500 font-bold">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Side Dishes */}
                <div data-aos="fade-up" data-aos-delay="500">
                  <h3 className="text-lg font-bold mb-4">Phần ăn phụ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sideItems.map((item) => (
                      <div
                        key={item._id}
                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
                        onClick={() => addToCart(item)}
                        data-aos="zoom-in"
                        data-aos-delay={500 + Number.parseInt(item._id) * 50}
                      >
                        <div className="h-32 bg-gray-100 flex items-center justify-center">
                          <img
                            src={item.preview.url || "/placeholder.svg"}
                            alt={item.title_translate_1}
                            className="h-24 w-24 object-cover"
                          />
                        </div>
                        <div className="p-3 text-center">
                          <h4 className="font-medium">{item.title_translate_1}</h4>
                          <p className="text-red-500 font-bold">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "drinks" && (
              <div data-aos="fade-up" data-aos-delay="400">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {drinkItems.map((item) => (
                    <div
                      key={item._id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
                      onClick={() => addToCart(item)}
                      data-aos="zoom-in"
                      data-aos-delay={400 + Number.parseInt(item._id) * 50}
                    >
                      <div className="h-32 bg-gray-100 flex items-center justify-center">
                        <img
                          src={item.preview.url || "/placeholder.svg"}
                          alt={item.tag_translate_1}
                          className="h-24 w-24 object-cover"
                        />
                      </div>
                      <div className="p-3 text-center">
                        <h4 className="font-medium">{item.title_translate_1}</h4>
                        <p className="text-red-500 font-bold">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm h-auto max-h-[80vh] overflow-hidden">
            <div className="max-h-[80vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="relative p-4 border-b">
                <h3 className="text-xl font-bold text-center">Phương thức thanh toán</h3>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4">
                {!paymentMethod ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaymentMethod("qr")}
                      className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <QrCode size={48} className="text-blue-600 mb-2" />
                      <span className="font-medium text-center">Thanh toán bằng QR</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("cash")}
                      className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                    >
                      <Wallet size={48} className="text-green-600 mb-2" />
                      <span className="font-medium text-center">Thanh toán bằng tiền mặt</span>
                    </button>
                  </div>
                ) : paymentMethod === "qr" ? (
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg border mb-4">
                      <h4 className="text-lg font-bold text-center mb-2">Đặt hàng thành công</h4>
                      <p className="text-center text-gray-600 mb-4">Mã đơn hàng #{orderId}</p>

                      <div className="border-t border-b py-4 my-4">
                        <h5 className="text-center font-medium mb-4">
                          Hướng dẫn thanh toán qua chuyển khoản ngân hàng
                        </h5>

                        <div className="flex justify-center mb-4">
                          <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yKB4MDTuuD7rS2ch4WSKzwWWgEvWcV.png"
                            alt="QR Payment"
                            className="w-48 h-48 object-contain"
                          />
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ngân hàng:</span>
                            <span className="font-medium">MBBank</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Chủ tài khoản:</span>
                            <span className="font-medium">Bùi Tấn Việt</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Số TK:</span>
                            <span className="font-medium">0903252427</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Số tiền:</span>
                            <span className="font-medium">{formatPrice(calculateTotal())}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nội dung CK:</span>
                            <span className="font-medium">{orderId}</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                          Lưu ý: Vui lòng giữ nguyên nội dung chuyển khoản {orderId} để hệ thống tự động xác nhận thanh
                          toán
                        </p>
                      </div>

                      <button
                        className={`w-full py-3 rounded-lg font-medium ${
                          paymentCompleted ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                        } text-white transition-colors`}
                        onClick={paymentCompleted ? handleOrderComplete : undefined}
                        disabled={!paymentCompleted}
                      >
                        {paymentCompleted ? "Hoàn tất đơn hàng!" : "Đang chờ thanh toán..."}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-6">
                    <div className="text-center mb-6">
                      <p className="text-lg font-medium mb-4">
                        Vui lòng di chuyển qua quầy thanh toán để hoàn tất đơn hàng 🍔😊❤️
                      </p>
                    </div>
                    <button
                      onClick={() => setPaymentMethod(null)}
                      className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                    >
                      Quay lại
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderAtStore