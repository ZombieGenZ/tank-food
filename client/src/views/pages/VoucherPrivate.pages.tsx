// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import { motion } from "framer-motion"
import { message } from "antd"
import { useNavigate } from "react-router-dom"
import Verify from "../components/VerifyToken.components"
import { RESPONSE_CODE } from "../../constants/responseCode.constants"
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL)

interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  aLert: NotificationProps
}

interface NotificationProps {
  addNotification: (message: string) => void;
}

interface DiscountCode {
  _id: string;
  code: string;
  user: string;
  discount: number;
  status: number;
  created_at: string | Date;
  updated_at: string | Date;
}

interface VoucherPublic {
  code: string;
  created_at: string; // hoặc có thể dùng Date nếu bạn sẽ chuyển đổi từ string
  created_by: string;
  discount: number;
  expiration_date: string; // hoặc Date
  quantity: number;
  requirement: number;
  status: number;
  storage: number;
  updated_at: string; // hoặc Date
  updated_by: string;
  used: number;
  _id: string;
}

const VoucherPrivate: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }
  const [messageApi, contextHolder] = message.useMessage();
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token")); 

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
    socket.emit('connect-user-realtime', refresh_token)

    socket.on('new-voucher-private', (res) => {
      setVouchers([...vouchers, res])
      props.aLert.addNotification(language() === "Tiếng Việt" ? "Có Voucher riêng tư mới" : "New  Private")
    })

    socket.on('use-voucher-private', (res) => {
      setVouchers(vouchers.map((item) => item._id === res._id ? res : item))
      props.aLert.addNotification(language() === "Tiếng Việt" ? "Có Voucher mới được sử dụng" : "A Voucher Used")
    })

    socket.on('create-public-voucher-storage', (res) => {
      setVoucherPublic([...voucherPublic, res])
      props.aLert.addNotification(language() === "Tiếng Việt" ? "Có Voucher mới" : "New Voucher Public")
    })

    socket.on('update-public-voucher-storage', (res) => {
      console.log(res)
      setVoucherPublic(voucherPublic.map((item) => item._id === res._id ? res : item))
      props.aLert.addNotification(language() === "Tiếng Việt" ? "Có Voucher mới cập nhật" : "A Voucher Updated")
    })

    socket.on('delete-public-voucher-storage', (res) => {
      setVoucherPublic(voucherPublic.filter((item) => item._id !== res._id))
      props.aLert.addNotification(language() === "Tiếng Việt" ? "Có Voucher mới được xoá" : "A Voucher Deleted")
    })

    socket.on('expired-public-voucher-storage', (res) => {
      setVoucherPublic(voucherPublic.filter((item) => item._id !== res._id))
      props.aLert.addNotification(language() === "Tiếng Việt" ? "Có Voucher mới hết hạn" : "A Voucher Expired")
    })

    return () => {
      socket.off('new-voucher-private')
      socket.off('use-voucher-private')
      socket.off('create-public-voucher-storage')
      socket.off('update-public-voucher-storage')
      socket.off('delete-public-voucher-storage')
      socket.off('expired-public-voucher-storage')
    }
  })

  useEffect(() => {
    if(refresh_token == null) {
      navigate('/errorpage')
    }
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          const body = {
            language: null,
            refresh_token: refresh_token
          }

          fetch(`${import.meta.env.VITE_API_URL}/api/voucher-private/get-voucher`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
          }).then(response => {
            return response.json()
          }).then((data) => {
            if(data.code == RESPONSE_CODE.GET_VOUCHER_FAILED) {
              messageApi.error("Lỗi khi lấy danh sách voucher");
              return
            }
            if(data.code == RESPONSE_CODE.GET_VOUCHER_SUCCESSFUL) {
              setVouchers(data.voucher_private)
              setVoucherPublic(data.voucher_public)
            }
          })
        } else {
          messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
    };
    checkToken()
  }, [refresh_token, access_token, messageApi])

  const [vouchers, setVouchers] = useState<DiscountCode[]>([])
  const [voucherPublic, setVoucherPublic] = useState<VoucherPublic[]>([])

  const [activeTab, setActiveTab] = useState<"active" | "used">("active")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
    })
  }, [])

  const getGradientByType = (price: number) => {
    if (price < 30000) {
      return "bg-gradient-to-r from-green-400 to-lime-500"; // Giá rẻ (màu xanh lá cây tươi tắn)
    } else if (price >= 30000 && price < 70000) {
      return "bg-gradient-to-r from-blue-400 to-cyan-400"; // Giá trung bình thấp (màu xanh dương nhẹ nhàng)
    } else if (price >= 70000 && price < 150000) {
      return "bg-gradient-to-r from-orange-400 to-yellow-400"; // Giá trung bình cao (màu cam ấm áp)
    } else if (price >= 150000 && price < 300000) {
      return "bg-gradient-to-r from-purple-400 to-violet-400"; // Giá hơi cao (màu tím dịu)
    } else if (price >= 300000) {
      return "bg-gradient-to-r from-red-400 to-pink-400"; // Giá cao (màu đỏ hoặc hồng nổi bật)
    } else {
      return "bg-gradient-to-r from-gray-500 to-gray-700"; // Giá không xác định (màu xám)
    }
  }

  function formatCurrency(amount: number, currencyCode = 'vi-VN', currency = 'VND') {
    const formatter = new Intl.NumberFormat(currencyCode, {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(amount);
  }

  function formatDateFromISO(isoDateString: string): string {
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
    messageApi.success("Copy thành công!");
  }

  const filteredVouchers = (vouchers || []).filter(
    (voucher) => (activeTab === "active" && voucher.status == 0) || (activeTab === "used" && voucher.status == 1),
  )

  const filterVoucherPublic = (voucherPublic || []).filter(
    (voucher) => (activeTab === "active" && voucher.status == 0) || (activeTab === "used" && voucher.status == 1),
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-6">
      {contextHolder}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
          {language() == "Tiếng Việt" ? "Voucher TankFood của bạn" : "Your TankFood Vouchers"}
        </h1>
        <p className="text-center text-gray-300 mb-8">
          {language() == "Tiếng Việt" ? "Sử dụng phiếu giảm giá độc quyền của bạn để thưởng thức những bữa ăn ngon với giá ưu đãi" : "Use your exclusive vouchers to enjoy delicious meals at discounted prices"}
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-6 cursor-pointer py-2 rounded-md transition-all duration-300 ${
                activeTab === "active"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {language() == "Tiếng Việt" ? "Voucher đang hoạt động" : "Active Vouchers"}
            </button>
            <button
              onClick={() => setActiveTab("used")}
              className={`px-6 cursor-pointer py-2 rounded-md transition-all duration-300 ${
                activeTab === "used"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {language() == "Tiếng Việt" ? "Voucher đã sử dụng" : "Used Vouchers"}
            </button>
          </div>
        </div>

        {/* Vouchers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVouchers && (
            filteredVouchers.map((voucher, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                data-aos="fade-up"
                data-aos-delay={Math.floor(Math.random() * 300)}
                className={`rounded-xl overflow-hidden shadow-lg relative ${
                  voucher.status == 1 ? "opacity-70" : ""
                }`}
              >
                <div
                  className={`${getGradientByType(
                    voucher.discount
                  )} p-5 relative overflow-hidden transition-all duration-300 group`}
                >
                  {/* Decorative elements */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-500"></div>

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{formatCurrency(voucher.discount)}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white text-opacity-90 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {language() == "Tiếng Việt" ? "HSD: Không giới hạn" : "EXP: Unlimited"}
                        </span>
                      </div>
                    </div>

                    {/* Thêm badge điều kiện sử dụng */}
                    <div className="bg-black bg-opacity-30 rounded-full px-3 py-1 text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {language() == "Tiếng Việt" ? "Đơn tối thiểu 0 đ" : "Min order 0 đ"}
                    </div>
                  </div>

                  {/* Thêm thông tin số lượng còn lại */}
                </div>

                <div className="bg-gray-800 p-4">
                  <div className="flex justify-between gap-5 items-center">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium bg-gray-700 px-3 py-1.5 rounded-lg text-white">{voucher.code}</div>
                      <motion.button
                        onClick={() => handleCopyCode(voucher.code)}
                        disabled={voucher.status == 1}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`relative cursor-pointer flex items-center justify-center w-10 h-10 rounded-full ${
                          voucher.status == 1
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-white text-gray-900 hover:shadow-lg"
                        }`}
                      >
                        <motion.div
                          initial={{ rotate: 0 }}
                          whileHover={{ rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </motion.div>
                        <span className="sr-only">Copy code</span>
                      </motion.button>
                    </div>
                    {copiedCode === voucher.code && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-8 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-md"
                      >
                        Copied!
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Thêm trạng thái voucher */}
                  <div className="mt-2 flex justify-between items-center text-sm">
                    <span className={`px-2 py-1 rounded-md text-white ${
                      voucher.status === 0
                        ? "bg-green-500 bg-opacity-20"
                        : "bg-red-500 bg-opacity-20"
                    }`}>
                      {voucher.status === 0 ? (language() == "Tiếng Việt" ? "Có thể sử dụng" : "Usable") : (language() == "Tiếng Việt" ? "Đã hết hiệu lực" : "Expired")}
                    </span>
                    <span className="text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDateFromISO(String(voucher.created_at))}
                    </span>
                  </div>
                </div>

                {/* Dashed border effect */}
                <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-white border-opacity-30"></div>
                <div className="absolute top-1/2 left-0 h-8 w-8 -ml-4 rounded-full bg-gray-900"></div>
                <div className="absolute top-1/2 right-0 h-8 w-8 -mr-4 rounded-full bg-gray-900"></div>
              </motion.div>
            ))
          )}
          {filterVoucherPublic && (
            filterVoucherPublic.map((voucher, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                data-aos="fade-up"
                data-aos-delay={Math.floor(Math.random() * 300)}
                className={`rounded-xl overflow-hidden shadow-lg relative ${
                  voucher.status == 1 ? "opacity-70" : ""
                }`}
              >
                <div
                  className={`${getGradientByType(
                    voucher.discount
                  )} p-5 relative overflow-hidden transition-all duration-300 group`}
                >
                  {/* Decorative elements */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-500"></div>

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{formatCurrency(voucher.discount)}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white text-opacity-90 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {language() == "Tiếng Việt" ? `HSD: ${formatDateFromISO(voucher.expiration_date)}` : `EXP: ${formatDateFromISO(voucher.expiration_date)}`}
                        </span>
                      </div>
                    </div>
                    
                    {/* Thêm badge điều kiện sử dụng */}
                    {voucher.requirement >= 0 && (
                      <div className="bg-black bg-opacity-30 rounded-full px-3 py-1 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {language() == "Tiếng Việt" ? `Đơn tối thiểu ${formatCurrency(voucher.requirement)}` : `Min order ${formatCurrency(voucher.requirement)}`}
                      </div>
                    )}
                  </div>

                  {/* Thêm thông tin số lượng còn lại */}
                </div>

                <div className="bg-gray-800 p-4">
                  <div className="flex justify-between gap-5 items-center">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium bg-gray-700 px-3 py-1.5 rounded-lg text-white">{voucher.code}</div>
                      <motion.button
                        onClick={() => handleCopyCode(voucher.code)}
                        disabled={voucher.status == 1}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`relative cursor-pointer flex items-center justify-center w-10 h-10 rounded-full ${
                          voucher.status == 1
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-white text-gray-900 hover:shadow-lg"
                        }`}
                      >
                        <motion.div
                          initial={{ rotate: 0 }}
                          whileHover={{ rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </motion.div>
                        <span className="sr-only">Copy code</span>
                      </motion.button>
                    </div>
                    {copiedCode === voucher.code && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-8 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-md"
                      >
                        Copied!
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Thêm trạng thái voucher */}
                  <div className="mt-2 flex justify-between items-center text-sm">
                    <span className={`px-2 py-1 rounded-md ${
                      voucher.status === 0 
                        ? "bg-green-500 bg-opacity-20" 
                        : "bg-red-500 bg-opacity-20"
                    }`}>
                      {voucher.status === 0 ? (language() == "Tiếng Việt" ? "Có thể sử dụng" : "Usable") : (language() == "Tiếng Việt" ? "Đã hết hiệu lực" : "Expired")}
                    </span>
                    <span className="text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDateFromISO(voucher.created_at)}
                    </span>
                  </div>
                </div>

                {/* Dashed border effect */}
                <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-white border-opacity-30"></div>
                <div className="absolute top-1/2 left-0 h-8 w-8 -ml-4 rounded-full bg-gray-900"></div>
                <div className="absolute top-1/2 right-0 h-8 w-8 -mr-4 rounded-full bg-gray-900"></div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default VoucherPrivate