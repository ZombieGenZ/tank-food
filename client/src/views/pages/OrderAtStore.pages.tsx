"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

interface FoodItem {
  id: string
  name: string
  price: number
  category: string
  subcategory?: string
  image: string
  quantity?: number
}

const OrderAtStore: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })
  }, [])

  const [activeTab, setActiveTab] = useState<"food" | "drinks">("food")
  const [cart, setCart] = useState<FoodItem[]>([
    {
      id: "1",
      name: "Burger Bò Phô Mai",
      price: 45000,
      category: "food",
      subcategory: "burger",
      image: "/placeholder.svg?height=100&width=100",
      quantity: 1,
    },
    {
      id: "2",
      name: "Khoai tây chiên",
      price: 25000,
      category: "food",
      subcategory: "side",
      image: "/placeholder.svg?height=100&width=100",
      quantity: 1,
    },
    {
      id: "3",
      name: "COCA-COLA",
      price: 15000,
      category: "drinks",
      image: "/placeholder.svg?height=100&width=100",
      quantity: 2,
    },
  ])

  const menuItems: FoodItem[] = [
    {
      id: "1",
      name: "Burger Bò Phô Mai",
      price: 45000,
      category: "food",
      subcategory: "burger",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "4",
      name: "Burger Gà Chiên",
      price: 40000,
      category: "food",
      subcategory: "burger",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "5",
      name: "Burger Cá Muối Ran",
      price: 65000,
      category: "food",
      subcategory: "burger",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      name: "Khoai Tây Chiên",
      price: 25000,
      category: "food",
      subcategory: "side",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "6",
      name: "Gà Rán (3 miếng)",
      price: 55000,
      category: "food",
      subcategory: "side",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "7",
      name: "Hot Dog",
      price: 20000,
      category: "food",
      subcategory: "side",
      image: "/placeholder.svg?height=100&width=100",
    },
    { id: "3", name: "COCA-COLA", price: 15000, category: "drinks", image: "/placeholder.svg?height=100&width=100" },
    { id: "8", name: "Pepsi", price: 15000, category: "drinks", image: "/placeholder.svg?height=100&width=100" },
    { id: "9", name: "Trà Đào", price: 20000, category: "drinks", image: "/placeholder.svg?height=100&width=100" },
  ]

  const addToCart = (item: FoodItem) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: (cartItem.quantity || 0) + 1 } : cartItem,
        ),
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 0), 0)
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}đ`
  }

  const filteredMenuItems = menuItems.filter(
    (item) =>
      (activeTab === "food" && item.category === "food") || (activeTab === "drinks" && item.category === "drinks"),
  )

  const burgerItems = filteredMenuItems.filter((item) => item.subcategory === "burger")
  const sideItems = filteredMenuItems.filter((item) => item.subcategory === "side")
  const drinkItems = filteredMenuItems.filter((item) => item.category === "drinks")

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
                    key={item.id}
                    className="flex justify-between items-center border-b pb-3"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 0) - 1)}
                        className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 0) + 1)}
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
                        key={item.id}
                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
                        onClick={() => addToCart(item)}
                        data-aos="zoom-in"
                        data-aos-delay={400 + Number.parseInt(item.id) * 50}
                      >
                        <div className="h-32 bg-gray-100 flex items-center justify-center">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-24 w-24 object-cover"
                          />
                        </div>
                        <div className="p-3 text-center">
                          <h4 className="font-medium">{item.name}</h4>
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
                        key={item.id}
                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
                        onClick={() => addToCart(item)}
                        data-aos="zoom-in"
                        data-aos-delay={500 + Number.parseInt(item.id) * 50}
                      >
                        <div className="h-32 bg-gray-100 flex items-center justify-center">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-24 w-24 object-cover"
                          />
                        </div>
                        <div className="p-3 text-center">
                          <h4 className="font-medium">{item.name}</h4>
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
                      key={item.id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
                      onClick={() => addToCart(item)}
                      data-aos="zoom-in"
                      data-aos-delay={400 + Number.parseInt(item.id) * 50}
                    >
                      <div className="h-32 bg-gray-100 flex items-center justify-center">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-24 w-24 object-cover"
                        />
                      </div>
                      <div className="p-3 text-center">
                        <h4 className="font-medium">{item.name}</h4>
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
    </div>
  )
}

export default OrderAtStore