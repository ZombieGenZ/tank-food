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
  discount: number|null;
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
  discount: number;
  price: number;
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
  const [passwordStrength, setPasswordStrength] = useState(0)
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
        console.log(data)
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

  const [formPass, setFormPass] = useState({
    password: "",
    new_password: "",
    confirm_new_password: "",
  })

  useEffect(() => {
    if (formPass.new_password.length === 0) {
      setPasswordStrength(0)
    } else if (formPass.new_password.length < 6) {
      setPasswordStrength(1)
    } else if (formPass.new_password.length < 10) {
      setPasswordStrength(2)
    } else if (/[A-Z]/.test(formPass.new_password) && /[0-9]/.test(formPass.new_password) && /[^A-Za-z0-9]/.test(formPass.new_password)) {
      setPasswordStrength(4)
    } else if (/[A-Z]/.test(formPass.new_password) && /[0-9]/.test(formPass.new_password)) {
      setPasswordStrength(3)
    } else {
      setPasswordStrength(2)
    }
  }, [formPass.new_password])
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

  const handleInputChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormPass((prev) => ({ ...prev, [name]: value }))
  }

  const handleChangePass = () => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
      if (isValid) {
        const body = {
          language: null,
          refresh_token: refresh_token,
          password: formPass.password,
          new_password: formPass.new_password,
          confirm_new_password: formPass.confirm_new_password
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/users/change-password`, {
          method: 'PUT',
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(body)
        }).then(response => {
          return response.json()
        }).then((data) => {
          if(data.code == RESPONSE_CODE.CHANGE_PASSWORD_SUCCESSFUL) {
            messageApi.success(data.message)
          } else if(data.code == RESPONSE_CODE.CHANGE_PASSWORD_FAILED || data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
            messageApi.error(data.message)
          }
        })
      } else {
        messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        return
      }
    };
    
    checkToken();
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
        return
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

  function formatCurrency(amount: number, currencyCode = 'vi-VN', currency = 'VND') {
    const formatter = new Intl.NumberFormat(currencyCode, {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(amount);
  }

  const statusColors: Record<string, string> = {
    "Thành công": "bg-green-100 text-green-600",
    "Duyệt thành công": "bg-green-100 text-green-600",
    "Đang giao": "bg-blue-100 text-blue-600",
    "Thất bại": "bg-red-100 text-red-600"
  };

  const getStrengthColor = () => {
    const colors = ["transparent", "#ef4444", "#f97316", "#eab308", "#22c55e"]
    return colors[passwordStrength]
  }

  const getStrengthText = () => {
    const texts = ["", "Weak", "Fair", "Good", "Strong"]
    return texts[passwordStrength]
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

              <motion.div variants={itemVariants}>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <motion.input
                    type="password"
                    id="password"
                    name="password"
                    value={formPass.password}
                    onChange={handleInputChangePass}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300 outline-none
                      ${
                        focusedInput === "password"
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-300"
                      }`}
                  />
                  {focusedInput === "password" && (
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
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <motion.input
                    type="password"
                    id="new_password"
                    name="new_password"
                    value={formPass.new_password}
                    onChange={handleInputChangePass}
                    onFocus={() => setFocusedInput("new_password")}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300 outline-none
                      ${
                        focusedInput === "new_password"
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-300"
                      }`}
                  />
                  {focusedInput === "new_password" && (
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500"
                    />
                  )}
                </div>
                {formPass.new_password && (
                <div className="password-strength visible-strength" data-animate>
                  <div className="strength-header">
                    <span className="strength-label">Password strength:</span>
                    <span className={`strength-text strength-${passwordStrength}`}>{getStrengthText()}</span>
                  </div>
                  <div className="strength-meter">
                    <div
                      className="strength-meter-bar"
                      style={{
                        width: `${passwordStrength * 25}%`,
                        backgroundColor: getStrengthColor(),
                      }}
                    ></div>
                  </div>
                  <ul className="password-requirements">
                    <li className={formPass.new_password.length >= 8 ? "requirement-met" : ""}>
                      <span>{formPass.new_password.length >= 8 ? "✓" : "○"}</span>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formPass.new_password) ? "requirement-met" : ""}>
                      <span>{/[A-Z]/.test(formPass.new_password) ? "✓" : "○"}</span>
                      Contains uppercase letter
                    </li>
                    <li className={/[0-9]/.test(formPass.new_password) ? "requirement-met" : ""}>
                      <span>{/[0-9]/.test(formPass.new_password) ? "✓" : "○"}</span>
                      Contains number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(formPass.new_password) ? "requirement-met" : ""}>
                      <span>{/[^A-Za-z0-9]/.test(formPass.new_password) ? "✓" : "○"}</span>
                      Contains special character
                    </li>
                  </ul>
                </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <motion.input
                    type="tel"
                    id="confirm_new_password"
                    name="confirm_new_password"
                    value={formPass.confirm_new_password}
                    onChange={handleInputChangePass}
                    onFocus={() => setFocusedInput("confirm_new_password")}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300 outline-none
                      ${
                        focusedInput === "confirm_new_password"
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-300"
                      }`}
                  />
                  {focusedInput === "confirm_new_password" && (
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
                  className="relative overflow-hidden cursor-pointer bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-2 rounded-md text-black font-medium shadow-md"
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
                  onClick={() => handleChangePass()}
                  type="button"
                  className="relative overflow-hidden cursor-pointer bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-2 rounded-md text-black font-medium shadow-md"
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
                  Đổi mật khẩu
                </motion.button>
                <motion.button
                  type="button"
                  className="relative overflow-hidden cursor-pointer bg-gray-300 px-6 py-2 rounded-md text-gray-700 font-medium"
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
                      className={`bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm ${statusColors[order.order_status === 0 ? "Đang chờ duyệt" : 
                                                                                                                order.order_status === 1 ? "Duyệt thành công" : 
                                                                                                                order.order_status === 2 ? "Đang giao" : 
                                                                                                                order.order_status === 3 ? "Giao đơn thành công" : 
                                                                                                                order.order_status === 4 ? "Thành công" : "Thất bại"]}`}
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
                        <span>{item.quantity}x {item.title_translate_1}</span>
                        <span>{formatCurrency(Number(item.price - (item.price * item.discount/100)) * item.quantity)}</span>
                      </motion.div>
                    ))}
                      <motion.div
                        className="flex justify-between text-sm"
                        whileHover={{
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          padding: "2px 4px",
                          borderRadius: "4px",
                          transition: { duration: 0.2 },
                        }}
                      >
                        <span>Phí ship: </span>
                        <span>{formatCurrency(Number(order.fee))}</span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between text-sm"
                        whileHover={{
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          padding: "2px 4px",
                          borderRadius: "4px",
                          transition: { duration: 0.2 },
                        }}
                      >
                        <span>Phí vat: </span>
                        <span>{formatCurrency(Number(order.vat))}</span>
                      </motion.div>
                      {order.order_status == 5 && 
                        <motion.div
                        className="flex justify-between text-sm"
                        whileHover={{
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          padding: "2px 4px",
                          borderRadius: "4px",
                          transition: { duration: 0.2 },
                        }}
                        >
                          <span>Đơn hàng bị từ chối vì lý do: </span>
                          <span>{order.cancellation_reason}</span>
                        </motion.div>
                      }
                  </div>

                  <motion.div
                    className="flex justify-end border-t pt-2 font-medium relative z-10"
                    whileHover={{
                      color: "#FF8200",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <span>Tổng tiền: {formatCurrency(order.total_bill)}</span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        /* Container and background */
        .password-change-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          position: relative;
          background: linear-gradient(to bottom right, #fef3c7, #fff7ed, #fef9c3);
        }
        
        .background-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-size: 500px;
          background-repeat: repeat;
        }
        
        /* Card styling */
        .password-card {
          width: 100%;
          max-width: 28rem;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          background-color: white;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .card-header {
          background: linear-gradient(to right, #f97316, #f59e0b);
          padding: 1.5rem;
          color: white;
        }
        
        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }
        
        .card-description {
          margin-top: 0.25rem;
          opacity: 0.8;
          font-size: 0.875rem;
        }
        
        .card-form {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        /* Form elements */
        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        
        .input-group {
          position: relative;
          display: flex;
        }
        
        .form-input {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
          transform: translateY(-1px);
        }

        .input-group:hover .form-input {
          border-color: #f59e0b;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transform: translateY(-1px);
        }
        
        /* Animated eye icon */
        .eye-icon {
          position: relative;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .eye-outer {
          width: 18px;
          height: 18px;
          border: 2px solid currentColor;
          border-radius: 75% 15%;
          transform: rotate(45deg);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .eye-inner {
          width: 8px;
          height: 8px;
          background-color: currentColor;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .eye-lash {
          position: absolute;
          width: 24px;
          height: 2px;
          background-color: currentColor;
          transform: rotate(45deg) scaleX(0);
          transform-origin: center;
          transition: transform 0.3s ease;
        }

        .eye-closed .eye-outer {
          height: 2px;
          border-radius: 0;
          border-width: 0;
          border-bottom-width: 2px;
        }

        .eye-closed .eye-inner {
          transform: scale(0);
        }

        .eye-closed .eye-lash {
          transform: rotate(45deg) scaleX(1);
        }

        .password-toggle {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          padding: 0 0.75rem;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          transition: all 0.3s ease;
        }

        .password-toggle:hover {
          color: #f59e0b;
          transform: scale(1.1);
        }

        .password-toggle:hover .eye-icon {
          transform: scale(1.1);
        }

        .password-toggle:active .eye-icon {
          transform: scale(0.9);
        }
        
        /* Password strength */
        .password-strength {
          margin-top: 0.5rem;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .visible-strength {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .strength-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        
        .strength-label {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .strength-text {
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .strength-1 { color: #ef4444; }
        .strength-2 { color: #f97316; }
        .strength-3 { color: #eab308; }
        .strength-4 { color: #22c55e; }
        
        .strength-meter {
          height: 0.375rem;
          background-color: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
        }
        
        .strength-meter-bar {
          height: 100%;
          transition: width 0.5s ease-out, background-color 0.5s ease;
        }
        
        .password-requirements {
          margin-top: 0.5rem;
          padding-left: 0;
          list-style: none;
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .password-requirements li {
          display: flex;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        
        .password-requirements li span {
          margin-right: 0.25rem;
        }
        
        .requirement-met {
          color: #22c55e;
        }
        
        .password-mismatch {
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
        
        /* Alert */
        .alert {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .alert-success {
          background-color: #f0fdf4;
          color: #166534;
          border: 1px solid #dcfce7;
        }
        
        .alert-error {
          background-color: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fee2e2;
        }
        
        .alert-icon {
          margin-right: 0.5rem;
        }
        
        /* Submit button */
        .submit-button {
          background: linear-gradient(to right, #f59e0b, #f97316);
          color: white;
          border: none;
          border-radius: 0.375rem;
          padding: 0.75rem 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          opacity: 0;
          transform: translateY(10px);
          position: relative;
          overflow: hidden;
        }

        .submit-button:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transition: all 0.6s ease;
        }

        .submit-button:hover {
          background: linear-gradient(to right, #d97706, #ea580c);
          transform: scale(1.03) translateY(-2px);
          box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        }

        .submit-button:hover:before {
          left: 100%;
        }

        .submit-button:active {
          transform: scale(0.98) translateY(0);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .arrow-icon {
          margin-left: 0.5rem;
          animation: pulse-move 1.5s infinite;
          display: inline-block;
        }

        @keyframes pulse-move {
          0%, 100% { 
            opacity: 1;
            transform: translateX(0);
          }
          50% { 
            opacity: 0.6;
            transform: translateX(3px);
          }
        }
        
        /* Footer */
        .footer {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          font-size: 0.75rem;
          color: #6b7280;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
      `}</style>
    </div>
  )
}

export default ProfilePage