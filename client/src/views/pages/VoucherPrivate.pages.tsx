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

interface DiscountCode {
  _id: string;
  code: string;
  user: string;
  discount: number;
  status: number;
  created_at: string | Date;
  updated_at: string | Date;
}

const VoucherPrivate: React.FC = () => {
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
              setVouchers(data.voucher)
            }
          })
        } else {
          messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
    };
    checkToken()
  }, [refresh_token, access_token, messageApi])

  const [vouchers, setVouchers] = useState<DiscountCode[]>([])

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
    switch (price) {
      case 20000:
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case 50000:
        return "bg-gradient-to-r from-blue-500 to-teal-400"
      case 10000:
        return "bg-gradient-to-r from-amber-500 to-orange-500"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-700"
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
  }

  const filteredVouchers = vouchers.filter(
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
          {filteredVouchers.length > 0 ? (
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
                      {/* <span className="inline-block px-3 py-1 bg-black bg-opacity-30 rounded-full text-sm mb-2">
                        {voucher.type === "percentage"
                          ? "Percentage Discount"
                          : voucher.type === "fixed"
                            ? "Fixed Amount"
                            : "Free Item"}
                      </span> */}
                      <h3 className="text-2xl font-bold mb-1">{formatCurrency(voucher.discount)}</h3>
                      <p className="text-white text-opacity-90">{formatDateFromISO(String(voucher.created_at))}</p>
                    </div>
                  </div>

                </div>

                <div className="bg-gray-800 p-4">
                  <div className="flex justify-between gap-5 items-center">
                    <p className={`text-sm font-medium px-3 py-2 rounded-md ${
                      voucher.status == 0 
                        ? "bg-amber-100 text-amber-800 border border-amber-200" 
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}>
                      {voucher.status == 0 
                        ? "Lưu ý: Voucher chỉ được sử dụng 1 lần duy nhất" 
                        : "Voucher đã được sử dụng"}
                    </p>
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
                </div>

                {/* Dashed border effect */}
                <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-white border-opacity-30"></div>
                <div className="absolute top-1/2 left-0 h-8 w-8 -ml-4 rounded-full bg-gray-900"></div>
                <div className="absolute top-1/2 right-0 h-8 w-8 -mr-4 rounded-full bg-gray-900"></div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-400">No vouchers found</h3>
                <p className="text-gray-500 mt-2">
                  {activeTab === "active"
                    ? "You don't have any active vouchers at the moment."
                    : "You haven't used any vouchers yet."}
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default VoucherPrivate