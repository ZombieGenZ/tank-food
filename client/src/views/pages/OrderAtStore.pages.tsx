"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Minus, ShoppingCart, X, QrCode, Wallet } from "lucide-react"
import AOS from "aos"
import { message } from "antd"
import "aos/dist/aos.css"
import { RESPONSE_CODE } from "../../constants/responseCode.constants"

interface Products {
  product_id: string;
  quantity: number;
  price: number;
  data: Product; // Sử dụng Record để đại diện cho object data
}

interface Information {
  account_name: string;
  account_no: string;
  bank_id: string;
  order_id: string;
  payment_qr_url: string;
  product: Products[];
  total_bill: number;
  total_price: number;
  total_quantity: number;
  vat: number;
}

interface ResponseData {
  infomation: Information;
  message: string;
  code: string;
}

interface ListProduct {
  product_id: string,
  quantity: number,
}

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
  const [messageApi, contextHolder] = message.useMessage();
  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }
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

  const [cart, setCart] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "cash" | null>(null)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [bill, setBill] = useState<ResponseData|null>(null)

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
    if (newQuantity == 0) {
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

  const handelByMoney = () => {
    const listproduct: ListProduct[] = cart.map((cart) => ({
      product_id: cart._id,
      quantity: cart.quantity ? cart.quantity : 0
    }))

    const body = {
      language: null,
      products: listproduct,
      payment_type: 0,
      voucher: null,
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/orders/order-offline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }).then(response => {
      return response.json()
    }).then((data) => {
      console.log(data)
      if(data.code == RESPONSE_CODE.CREATE_ORDER_SUCCESSFUL){
        messageApi.success(data.message)
        setBill(data)
        setCart([])
      } else {
        messageApi.error(data.message)
        return;      }
    })
  }

  const openModal = () => {
    if(cart.length == 0) {
      messageApi.error("Vui lòng chọn ít nhất 1 món !");
      return;
    }
    setIsModalOpen(true)
    setPaymentMethod(null)
    setPaymentCompleted(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setPaymentMethod(null)
    setPaymentCompleted(false)
  }

  const handleCreateBill = () => {
    const listproduct: ListProduct[] = cart.map((cart) => ({
      product_id: cart._id,
      quantity: cart.quantity ? cart.quantity : 0
    }))

    const body = {
      language: null,
      products: listproduct,
      payment_type: 1,
      voucher: null,
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/orders/order-offline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }).then(response => {
      return response.json()
    }).then((data) => {
      console.log(data)
      if(data.code == RESPONSE_CODE.CREATE_ORDER_SUCCESSFUL){
        messageApi.success(data.message)
        setBill(data)
      } else {
        messageApi.error(data.message)
        return;      }
    })
  }

  const handleOrderComplete = () => {
    closeModal()
    
    setCart([])
  }

  const filteredProducts = selectedCategoryId
  ? product.filter((item) => item.categories?._id === selectedCategoryId)
  : product;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      {contextHolder}
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
                   selectedCategoryId === null ? "text-red-500 border-b-2 border-red-500" : "text-gray-500 hover:text-gray-700"
                 }`}
                 onClick={() => setSelectedCategoryId(null)}
               >
                 {language() == "Tiếng Việt" ? "Tất cả" : "All"}
               </button>
              {Category.map(category => 
                <button
                 className={`pb-2 px-4 font-medium transition-all ${
                   selectedCategoryId === category._id ? "text-red-500 border-b-2 border-red-500" : "text-gray-500 hover:text-gray-700"
                 }`}
                 onClick={() => setSelectedCategoryId(category._id)}
               >
                 {language() == "Tiếng Việt" ? category.category_name_translate_1 : category.category_name_translate_2}
               </button>
              )}
            </div>
              <>
                {/* Burgers */}
                <div data-aos="fade-up" data-aos-delay="400">
                  <h3 className="text-lg font-bold mb-4">Burger</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {filteredProducts.map((item, index) => (
                      <div
                        key={index}
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
              </>
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
                      onClick={() => {setPaymentMethod("qr"); handleCreateBill()}}
                      className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <QrCode size={48} className="text-blue-600 mb-2" />
                      <span className="font-medium text-center">Thanh toán bằng QR</span>
                    </button>
                    <button
                      onClick={() => {setPaymentMethod("cash"); handelByMoney()}}
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
                          Vui lòng chuyển khoản qua mã QR dưới đây
                        </h5>

                        <div className="flex justify-center mb-4">
                          <img
                            src={bill?.infomation.payment_qr_url}
                            alt="QR Payment"
                            className="w-48 h-48 object-contain"
                          />
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ngân hàng:</span>
                            <span className="font-medium">{bill?.infomation.bank_id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Chủ tài khoản:</span>
                            <span className="font-medium">{bill?.infomation.account_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Số TK:</span>
                            <span className="font-medium">{bill?.infomation.account_no}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Số tiền:</span>
                            <span className="font-medium">{formatPrice(calculateTotal())}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nội dung CK:</span>
                            <span className="font-medium">{bill?.infomation.order_id}</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                          Lưu ý: Vui lòng giữ nguyên nội dung chuyển khoản {bill?.infomation.order_id} để hệ thống tự động xác nhận thanh
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