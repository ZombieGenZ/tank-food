"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom";
import Verify from "../components/VerifyToken.components";
import { message } from "antd";
import { RESPONSE_CODE } from "../../constants/responseCode.constants";

interface User {
  _id: string;
  display_name: string;
  email: string;
  phone: string;
  role: number;
  user_type: number;
  created_at: string;
  updated_at: string;
  penalty: null | string; // Nếu `penalty` có thể chứa giá trị khác null, hãy thay đổi kiểu dữ liệu phù hợp
}

interface HistoryOrder {
  _id: string;
  canceled_at: string;
  canceled_by: string | null;
  cancellation_reason: string;
  completed_at: string;
  confirmmed_at: string;
  created_at: string;
  delivered_at: string;
  delivering_at: string;
  delivery_address: string | null;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  delivery_nation: string | null;
  delivery_type: number | null;
  discount_code: string | null;
  distance: number | null;
  email: string | null;
  estimated_time: string | null;
  fee: number;
  is_first_transaction: boolean;
  moderated_by: string;
  name: string | null;
  node: string;
  order_status: number;
  payment_status: number;
  payment_type: number;
  phone: string | null;
  product: Product[];
  receiving_address: string | null;
  receiving_latitude: number | null;
  receiving_longitude: number | null;
  receiving_nation: string | null;
  shipper: string | null;
  suggested_route: string | null;
  total_bill: number;
  total_price: number;
  total_quantity: number;
  updated_at: string;
  user: string | null;
  vat: number;
}

interface Product {
  availability: string;
  category: Category;
  created_at: string;
  description_translate_1: string;
  description_translate_1_language: string;
  description_translate_2: string;
  description_translate_2_language: string;
  preview: Preview;
  price: string;
  product_id: string;
  quantity: number;
  title_translate_1: string;
  title_translate_1_language: string;
  title_translate_2: string;
  title_translate_2_language: string;
  updated_at: string;
  _id: string;
}

interface Category {
  category_name_translate_1: string;
  category_name_translate_2: string;
  created_at: string;
  index: number;
  translate_1_language: string;
  translate_2_language: string;
  updated_at: string;
  _id: string;
}

interface Preview {
  path: string;
  size: number;
  type: string;
  url: string;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"info" | "history">("info")
  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }
  const [messageApi, contextHolder] = message.useMessage();
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token")); 

  const [historyBill, setHistoryBill] = useState<HistoryOrder[]>([])
  useEffect(() => {
      const handleStorageChange = () => {
        setRefreshToken(localStorage.getItem("refresh_token"));
        setAccessToken(localStorage.getItem("access_token"));
      };
          
      window.addEventListener("storage", handleStorageChange);
          
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }, []);

  useEffect(() => {
    const body = {
      language: null,
      refresh_token: refresh_token
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-order`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body)
    }).then(response => {
      return response.json()
    }).then((data) => {
      if(data.code == RESPONSE_CODE.GET_ORDER_SUCCESSFUL){
        messageApi.success(data.message)
        setHistoryBill(data.order)
      } else {
        messageApi.error(data.message)
        return
      }
    })
  }, [refresh_token, access_token])

  const location = useLocation();
  const data: User = location.state;
  const [user, setUser] = useState<User>(data)
  const [formData, setFormData] = useState({
    name: user.display_name,
    email: user.email,
    phone: user.phone,
  })
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  function isValidPhoneNumber(phone: string) {
    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
    return phoneRegex.test(phone);
  }

  // function isValidEmail(email: string) {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // }

  // Sample order data

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    if(!isValidPhoneNumber(formData.phone)) {
      messageApi.error(language() == "Tiếng Việt" ? "Số điện thoại không hợp lệ" : "Invalid phone number")
      return;
    }

    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
      if (isValid) {
        const body = {
          language: null,
          refresh_token: refresh_token,
          display_name: formData.name,
          phone: formData.phone,
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/users/change-infomation`, {
          method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then((response) => {
          return response.json()
        }).then((data) => {
          console.log(data)
          if(data.code == RESPONSE_CODE.CHANGE_INFORMATION_SUCCESSFUL) {
            const body = {
              language: null,
              refresh_token: refresh_token,
            };
        
            fetch(`${import.meta.env.VITE_API_URL}/api/users/get-user-infomation`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body),
            }).then((response) => response.json()).then((data) => {
              setUser(data.infomation);
            })
            messageApi.success(language() == "Tiếng Việt" ? data.message : "Change profile successfully. ")
          } else {
            messageApi.error(language() == "Tiếng Việt" ? "Lỗi khi thay đổi thông tin người dùng" : "Change profile failed , please try again !")
          }
        })
      } else {
        messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
      }
  };
  
  checkToken();
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      {contextHolder}
      {/* Header with gradient background */}
      <motion.div
        className="rounded-lg mb-6 overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          y: -2,
          transition: { duration: 0.2 },
        }}
      >
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Hồ Sơ Của Tôi</h1>
            <p className="text-black mt-1">Quản lý thông tin cá nhân và theo dõi đơn hàng của bạn</p>
          </div>
          <motion.div
            className="text-right bg-white/20 backdrop-blur-sm p-3 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-4xl font-bold">{historyBill.length}</div>
            <div>Đơn hàng</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="border-b border-gray-200 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <nav className="-mb-px flex space-x-8">
          <motion.button
            onClick={() => setActiveTab("info")}
            className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
              activeTab === "info"
                ? "border-red-500 text-red-500"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            whileHover={
              activeTab !== "info"
                ? {
                    color: "#374151",
                    borderColor: "#E5E7EB",
                    transition: { duration: 0.2 },
                  }
                : {}
            }
            whileTap={{ scale: 0.97 }}
          >
            Thông tin cá nhân
            {activeTab === "info" && (
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("history")}
            className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
              activeTab === "history"
                ? "border-red-500 text-red-500"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            whileHover={
              activeTab !== "history"
                ? {
                    color: "#374151",
                    borderColor: "#E5E7EB",
                    transition: { duration: 0.2 },
                  }
                : {}
            }
            whileTap={{ scale: 0.97 }}
          >
            Lịch sử đặt hàng
            {activeTab === "history" && (
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        </nav>
      </motion.div>

      {/* Content Area with AnimatePresence for smooth tab transitions */}
      <AnimatePresence mode="wait">
        {/* Personal Information Form */}
        {activeTab === "info" && (
          <motion.div
            key="info"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 20 }}
            className="max-w-3xl mx-auto"
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold mb-6"
              whileHover={{ scale: 1.01, color: "#FF8200" }}
            >
              Thông tin cá nhân
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <motion.input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput("name")}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300 outline-none
                      ${
                        focusedInput === "name"
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-300"
                      }`}
                  />
                  {focusedInput === "name" && (
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500"
                    />
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    readOnly
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300 outline-none
                      ${
                        focusedInput === "email"
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-300"
                      }`}
                  />
                  {focusedInput === "email" && (
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500"
                    />
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <motion.input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput("phone")}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300 outline-none
                      ${
                        focusedInput === "phone"
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-300"
                      }`}
                  />
                  {focusedInput === "phone" && (
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500"
                    />
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex space-x-4 pt-4">
                <motion.button
                  type="submit"
                  className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-2 rounded-md text-black font-medium shadow-md"
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-white"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{
                      scale: 1.5,
                      opacity: 0.2,
                      transition: { duration: 0.5 },
                    }}
                    style={{ borderRadius: "100%" }}
                  />
                  Lưu thay đổi
                </motion.button>
                <motion.button
                  type="button"
                  className="relative overflow-hidden bg-gray-300 px-6 py-2 rounded-md text-gray-700 font-medium"
                  whileHover={{
                    scale: 1.03,
                    backgroundColor: "#D1D5DB",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-white"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{
                      scale: 1.5,
                      opacity: 0.2,
                      transition: { duration: 0.5 },
                    }}
                    style={{ borderRadius: "100%" }}
                  />
                  Huỷ
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        )}

        {/* Order History */}
        {activeTab === "history" && (
          <motion.div
            key="history"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 20 }}
            className="max-w-3xl mx-auto"
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold mb-4"
              whileHover={{ scale: 1.01, color: "#FF8200" }}
            >
              Lịch sử đặt hàng
            </motion.h2>

            <motion.p variants={itemVariants} className="text-gray-600 mb-6">
              Xem lại các đơn hàng mà bạn đã đặt
            </motion.p>

            <div className="space-y-6">
              {historyBill.map((order, index) => (
                <motion.div
                  key={order._id}
                  variants={itemVariants}
                  custom={index}
                  className="border border-gray-200 rounded-lg p-4 relative overflow-hidden"
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    borderColor: "#FF8200",
                    transition: { duration: 0.2 },
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-100 to-orange-100 opacity-0"
                    whileHover={{ opacity: 0.5, transition: { duration: 0.3 } }}
                  />

                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h3 className="font-medium">Đơn hàng #{order._id}</h3>
                      <p className="text-sm text-gray-500">Ngày đặt: {order.created_at}</p>
                    </div>
                    <motion.div
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "#DEF7EC",
                        transition: { duration: 0.2 },
                      }}
                    >
                      {order.order_status === 0 ? "Đang chờ duyệt" : 
                          order.order_status === 1 ? "Duyệt thành công" : 
                          order.order_status === 2 ? "Đang giao" : 
                          order.order_status === 3 ? "Giao đơn thành công" : 
                          order.order_status === 4 ? "Thành công" : "Thất bại"}
                    </motion.div>
                  </div>

                  <div className="space-y-2 mb-3 relative z-10">
                    {order.product.map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex justify-between text-sm"
                        whileHover={{
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          padding: "2px 4px",
                          borderRadius: "4px",
                          transition: { duration: 0.2 },
                        }}
                      >
                        <span>1x {item.title_translate_1}</span>
                        <span>{item.price.toLocaleString()}đ</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="flex justify-end border-t pt-2 font-medium relative z-10"
                    whileHover={{
                      color: "#FF8200",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <span>Tổng tiền: {order.total_bill.toLocaleString()}đ</span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfilePage