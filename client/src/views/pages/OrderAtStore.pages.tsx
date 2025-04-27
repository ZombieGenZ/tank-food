// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Plus, Minus, ShoppingCart, X, QrCode, Wallet } from "lucide-react"
import AOS from "aos"
import { message, Modal, Input, Button } from "antd"
import "aos/dist/aos.css"
import { motion } from 'framer-motion';
import { RESPONSE_CODE } from "../../constants/responseCode.constants"
import io from "socket.io-client";
import '../../../public/css/Order.css';
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import layout from "simple-keyboard-layouts/build/layouts/english";
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';

const socket = io(import.meta.env.VITE_API_URL)

interface SparkProps {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onComplete: () => void;
}

const Spark: React.FC<SparkProps> = ({ x, y, vx, vy, onComplete }) => {
  return (
    <motion.div
      initial={{
        x: x - 5,
        y: y - 5,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        x: x + vx,
        y: y + vy,
        opacity: 0,
        scale: 0.5,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      onAnimationComplete={onComplete}
      style={{
        position: "absolute",
        width: "10px",
        height: "10px",
        backgroundColor: "orange",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    />
  );
};

interface SparkData {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Products {
  product_id: string;
  quantity: number;
  price: number;
  data: Product1; // Sử dụng Record để đại diện cho object data
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

interface Product1 {
  _id: string;
  availability: boolean;
  category: string;
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
  quantity: number;
}

const OrderAtStore: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [sparks, setSparks] = useState<SparkData[]>([]);
  const [layoutName, setLayoutName] = useState("default");
  const keyboardRef = useRef<string>(null);

  const handleClick = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    const numberOfSparks = 15;

    for (let i = 0; i < numberOfSparks; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const baseSpeed = 20;
      const speedVariation = Math.random() * 30;
      const distance = 5 + Math.random() * 15;
      const speed = baseSpeed + speedVariation * (distance / 15); // Tốc độ ảnh hưởng bởi distance

      setSparks((prevSparks) => [
        ...prevSparks,
        {
          id: Date.now() + i,
          x: clientX,
          y: clientY,
          vx: speed * Math.cos(angle),
          vy: speed * Math.sin(angle),
        },
      ]);
    }
  };

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }
  };

  useEffect(() => {
    if(bill?.infomation.order_id) {
      socket.emit('connect-payment-realtime', bill?.infomation.order_id);
    }

    socket.on('payment_notification', (res) => {
      if(res.payment_status == 1) {
        messageApi.success("Thanh toán thành công!")
        setPaymentCompleted(true)
      } else {
        messageApi.success("Thanh toán thất bại!")
        return;
      }
    })
  
    return () => {
      socket.off('payment_notification')
    };
  });

  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }
  const [product, setProduct] = useState<Product[]>([]);
  const [Category, setCategory] = useState<Category[]>([]);
  const [voucher, setVoucher] = useState<string|null>(null)
  const [showModalVoucher, setShowModalVoucher] = useState<boolean>(false)
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: true,
      offset:10
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
          console.log(data.products)
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
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  useEffect(() => {
    if (isModalOpen) {
      // Generate a random order ID when modal opens
      setOrderId(`DH${Math.floor(1000 + Math.random() * 9000)}`)
    }
  }, [isModalOpen])


  // Simulate payment completion after 5 seconds when in QR mode

  const ShowModalVoucher = () => {
    setShowModalVoucher(true)
  }

  const handleChangeVoucher = (e: string|null) =>{
    setVoucher(e)
  }

  const addToCart = (item: Product) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id)
    const discountedPrice = item.price * (1 - item.discount / 100); 
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: (cartItem.quantity || 0) + 1 } // Chỉ tăng số lượng
            : cartItem,
        ),
      );
    } else {
      setCart([...cart, { ...item, price: discountedPrice, quantity: 1 }]); // Thêm sản phẩm với giá đã giảm
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

  function formatCurrency(amount: number, currencyCode = 'vi-VN', currency = 'VND') {
    const formatter = new Intl.NumberFormat(currencyCode, {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(amount);
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
      voucher: voucher || null,
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
    setShowModalVoucher(false)
    setIsModalOpen(true)
    setPaymentMethod(null)
    setPaymentCompleted(false)
  }

  const closeModal = () => {
    setShowModalVoucher(false)
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
      voucher: voucher || null,
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
        return;      
      }
    })
  }

  const handleOrderComplete = () => {
    closeModal()
    setPaymentCompleted(false)
    setCart([])
  }

  const filteredProducts = selectedCategoryId
  ? product.filter((item) => item.categories?._id === selectedCategoryId)
  : product;

  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null!);

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };


  return (
    <div className="min-h-screen bg-white p-4 md:p-8" onClick={handleClick}>
      {contextHolder}
      {sparks.map((spark) => (
        <Spark
          key={spark.id}
          x={spark.x}
          y={spark.y}
          vx={spark.vx}
          vy={spark.vy}
          onComplete={() =>
            setSparks((prev) => prev.filter((s) => s.id !== spark.id))
          }
        />
      ))}
      <div className="max-w-7xl mx-auto" data-aos="fade-up" data-aos-delay="100">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
          <div className="font-bold mb-6 ">Tank<span className="text-yellow-300">Food</span></div>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section - Left (2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100" data-aos="fade-right" data-aos-delay="200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="mr-2 flex "><div className="font-bold mb-6 bg-gradient-to-r bg-clip-text from-orange-500 to-orange-600 text-transparent">Tank<span className="text-yellow-300">Food</span></div>'s menu</span>
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            </h2>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-hidden overflow-x-auto scrollbar-hide mb-6">
              <button
                className={`pb-2 px-4 cursor-pointer font-medium transition-all whitespace-nowrap ${
                  selectedCategoryId === null ? "text-orange-500 border-b-2 border-orange-500 font-bold" : "text-gray-500 hover:text-orange-500"
                }`}
                onClick={() => setSelectedCategoryId(null)}
              >
                {language() == "Tiếng Việt" ? "Tất cả" : "All"}
              </button>
              {Category.map(category => 
                <button
                  key={category._id}
                  className={`pb-2 px-4 cursor-pointer font-medium transition-all whitespace-nowrap ${
                    selectedCategoryId === category._id ? "text-orange-500 border-b-2 border-orange-500 font-bold" : "text-gray-500 hover:text-orange-500"
                  }`}
                  onClick={() => setSelectedCategoryId(category._id)}
                >
                  {language() == "Tiếng Việt" ? category.category_name_translate_1 : category.category_name_translate_2}
                </button>
              )}
            </div>
            <>
              <div data-aos="fade-up" data-aos-delay="400">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {filteredProducts.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer border border-gray-100"
                      onClick={() => addToCart(item)}
                      data-aos="zoom-in"
                      data-aos-delay={400 + Number.parseInt(item._id) * 50}
                    >
                      <div className="h-32 bg-gray-50 flex items-center justify-center">
                        <img
                          src={item.preview.url || "/placeholder.svg"}
                          alt={item.title_translate_1}
                          className="h-24 w-24 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                      <div className="p-3 text-center">
                        <h4 className="font-medium text-gray-800">{item.title_translate_1}</h4>
                        <div className="flex justify-center items-center space-x-2 mt-2">
                          <p className={`font-bold ${item.discount > 0 ? "line-through text-gray-400" : "text-orange-500"}`}>{formatCurrency(item.price)}</p>
                          {item.discount > 0 && (<p className="text-orange-500 font-bold">{formatCurrency(item.price - item.price * item.discount/100)}</p>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          </div>

          {/* Cart Section - Right (1 column) */}
          <div
            className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 h-fit border border-gray-100 sticky top-4"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2 text-gray-800">Danh sách đồ ăn đã chọn</h2>

            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <div className="text-gray-400 text-center py-6 flex flex-col items-center">
                  <ShoppingCart size={48} className="text-gray-300 mb-2 opacity-50" />
                  <p>Giỏ hàng trống</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border-b border-gray-100 pb-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.title_translate_1}</p>
                      <p className="text-orange-500">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item._id, (item.quantity || 0) - 1);
                        }}
                        className="w-7 cursor-pointer h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={16} className="text-gray-700" />
                      </button>
                      <span className="w-6 text-center font-bold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item._id, (item.quantity || 0) + 1);
                        }}
                        className="w-7 cursor-pointer h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Plus size={16} className="text-gray-700" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className={`mt-6 ${cart.length > 0 ? "border-none" : "border-t border-gray-200"} pt-4`}>
              <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
                <span className="text-lg font-bold text-gray-800">Tổng tiền:</span>
                <span className="text-lg font-bold text-orange-500">{formatCurrency(calculateTotal())}</span>
              </div>

              <button
                className="relative cursor-pointer w-full py-3 bg-orange-500 text-white rounded-lg font-medium overflow-hidden group transition-all duration-300 ease-out hover:bg-orange-600 active:scale-95 shadow-md"
                data-aos="zoom-in"
                data-aos-delay="400"
                onClick={ShowModalVoucher}
                disabled={cart.length === 0}
              >
                <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 group-hover:scale-100 group-hover:bg-orange-600/30 rounded-lg"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <span className="inline-block transition-all duration-500 group-hover:scale-105 group-hover:font-bold group-hover:text-white group-hover:drop-shadow-sm">
                    Đặt ngay
                  </span>
                  <ShoppingCart className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50">
          {/* Lớp nền đen mờ + blur */}
          <div className="absolute inset-0 bg-black opacity-60 backdrop-blur-sm z-40"></div>

          {/* Card modal nằm phía trên lớp mờ */}
          <div className="absolute inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm h-auto max-h-[80vh] overflow-hidden">
              <div className="max-h-[80vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="relative p-4 border-b border-gray-200 bg-white">
                  <h3 className="text-xl font-bold text-center text-gray-800">Phương thức thanh toán</h3>
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
                        onClick={() => { setPaymentMethod("qr"); handleCreateBill(); }}
                        className="flex flex-col items-center justify-center cursor-pointer p-6 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-gray-50 transition-all"
                      >
                        <QrCode size={48} className="text-orange-500 mb-2" />
                        <span className="font-medium text-center text-gray-800">Thanh toán bằng QR</span>
                      </button>
                      <button
                        onClick={() => { setPaymentMethod("cash"); handelByMoney(); }}
                        className="flex flex-col items-center justify-center cursor-pointer p-6 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-gray-50 transition-all"
                      >
                        <Wallet size={48} className="text-orange-500 mb-2" />
                        <span className="font-medium text-center text-gray-800">Thanh toán bằng tiền mặt</span>
                      </button>
                    </div>
                  ) : paymentMethod === "qr" ? (
                    <div className="flex flex-col items-center">
                      {bill && bill.infomation ? (
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                          <h4 className="text-lg font-bold text-center mb-2 text-gray-800">Đặt hàng thành công</h4>
                          <p className="text-center text-gray-600 mb-4">Mã đơn hàng #{orderId}</p>

                          <div className="border-t border-b border-gray-200 py-4 my-4">
                            <h5 className="text-center font-medium mb-4 text-gray-700">
                              Vui lòng chuyển khoản qua mã QR dưới đây
                            </h5>

                            <div className="flex justify-center mb-4 bg-white p-2 rounded-lg border border-gray-200">
                              <img
                                src={bill?.infomation.payment_qr_url}
                                alt="QR Payment"
                                className="w-48 h-48 object-contain"
                              />
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                                <span className="text-gray-600">Ngân hàng:</span>
                                <span className="font-medium text-gray-800">{bill?.infomation.bank_id}</span>
                              </div>
                              <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                                <span className="text-gray-600">Chủ tài khoản:</span>
                                <span className="font-medium text-gray-800">{bill?.infomation.account_name}</span>
                              </div>
                              <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                                <span className="text-gray-600">Số TK:</span>
                                <span className="font-medium text-gray-800">{bill?.infomation.account_no}</span>
                              </div>
                              <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                                <span className="text-gray-600">Số tiền:</span>
                                <span className="font-medium text-orange-500">{formatCurrency(bill?.infomation.total_bill ?? 0)}</span>
                              </div>
                              <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                                <span className="text-gray-600">Phí VAT:</span>
                                <span className="font-medium text-orange-500">{formatCurrency(bill?.infomation.vat ?? 0)}</span>
                              </div>
                              <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                                <span className="text-gray-600">Nội dung CK:</span>
                                <span className="font-medium text-gray-800">{bill?.infomation.order_id}</span>
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 mt-4 bg-gray-50 p-2 rounded-md">
                              Lưu ý: Vui lòng giữ nguyên nội dung chuyển khoản {bill?.infomation.order_id} để hệ thống tự động xác nhận thanh toán
                            </p>
                          </div>

                          <button
                            className={`w-full py-3 rounded-lg font-medium ${paymentCompleted ? "bg-orange-500 hover:bg-orange-600 cursor-pointer" : "bg-gray-400 cursor-not-allowed"} text-white transition-colors shadow-md`}
                            onClick={paymentCompleted ? handleOrderComplete : undefined}
                            disabled={!paymentCompleted}
                          >
                            {paymentCompleted ? "Hoàn tất đơn hàng!" : "Đang chờ thanh toán..."}
                          </button>
                        </div>) : <p className="text-center text-gray-500">Đang tải thông tin thanh toán...</p>}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200">
                      <div className="text-center mb-6">
                        <p className="text-lg font-medium mb-4 text-gray-800">
                          Vui lòng di chuyển qua quầy thanh toán để hoàn tất đơn hàng 🍔😊❤️
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {/* Voucher Modal */}
      <Modal
        centered
        title={<span className="text-gray-800">Nhập mã giảm giá (nếu có)</span>}
        open={showModalVoucher}
        okText={voucher ? "Áp dụng" : "Bỏ qua"}
        cancelText="Huỷ"
        onOk={openModal}
        onCancel={() => {setShowModalVoucher(false); setVoucher("")}}
        onClose={() => {setShowModalVoucher(false); setVoucher("")}}
        className="w-full max-w-md mx-auto"
        okButtonProps={{
            style: {
                backgroundColor: '#F97316',
                borderColor: '#F97316',
                fontWeight: 'bold', // Làm đậm chữ
                borderRadius: '6px', // Bo tròn nhẹ góc
            },
        }}
        cancelButtonProps={{
            style: {
                // Có thể thêm style nếu bạn muốn tùy chỉnh thêm nút Huỷ
                // Ví dụ: backgroundColor: 'white', color: '#777', border: '1px solid #ccc', borderRadius: '6px'
                color: '#777',
                backgroundColor: 'white',
                borderColor: '#ccc',
                border: '1px solid #ccc',
                borderRadius: '6px',
            },
        }}
    >
        <div className="flex gap-4">
            <Input
                placeholder="Nhập mã giảm giá"
                onChange={(e) => handleChangeVoucher(e.target.value)}
                value={voucher ?? ""}
                className="border-gray-300 focus:border-orange-500"
            />
            <Button type="primary" onClick={() => setIsInputFocused(true)}>Mở bàn phím</Button>
        </div>
    </Modal>

      <Modal footer={null} mask={false} title={
          <div
            style={{ width: '100%', cursor: 'move' }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
          >
            Draggable Modal
          </div>
        } modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )} open={isInputFocused}
          onClose={() => setIsInputFocused(false)} onCancel={() => setIsInputFocused(false)}
          style={{ // Thêm style này
            position: 'absolute',
            bottom: 0,
            zIndex: 1000, // Đảm bảo nó ở trên các phần khác
          }}>
        <Keyboard
          keyboardRef={(r) => (keyboardRef.current = r)}
          layoutName={layoutName}
          onChange={handleChangeVoucher}
          onKeyPress={onKeyPress}
          layout={layout.layout}
          theme="hg-theme-default hg-layout-default"
        />
      </Modal>
    </div>
  )
}

export default OrderAtStore