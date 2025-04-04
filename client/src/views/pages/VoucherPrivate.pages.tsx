"use client"

import type React from "react"
import { useEffect, useState } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import { motion } from "framer-motion"

interface Voucher {
  id: string
  code: string
  discount: string
  validUntil: string
  description: string
  type: "percentage" | "fixed" | "freeItem"
  used: boolean
  minOrder?: number
}

interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const VoucherPrivate: React.FC<Props> = (props) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([
    {
      id: "v1",
      code: "BURGER50",
      discount: "50%",
      validUntil: "2025-05-30",
      description: "50% off on all burgers",
      type: "percentage",
      used: false,
      minOrder: 15,
    },
    {
      id: "v2",
      code: "FREEFRIES",
      discount: "Free Fries",
      validUntil: "2025-04-15",
      description: "Free large fries with any burger purchase",
      type: "freeItem",
      used: false,
      minOrder: 20,
    },
    {
      id: "v3",
      code: "TANK10",
      discount: "$10",
      validUntil: "2025-06-01",
      description: "$10 off on orders above $30",
      type: "fixed",
      used: false,
      minOrder: 30,
    },
    {
      id: "v4",
      code: "CHICKEN25",
      discount: "25%",
      validUntil: "2025-05-10",
      description: "25% off on all fried chicken items",
      type: "percentage",
      used: false,
      minOrder: 35,
    },
    {
      id: "v5",
      code: "WELCOME15",
      discount: "15%",
      validUntil: "2025-04-20",
      description: "15% off on your first order",
      type: "percentage",
      used: true,
      minOrder: 20,
    },
    // 5 voucher mới
    {
      id: "v6",
      code: "COMBO2OFF",
      discount: "$2",
      validUntil: "2025-07-15",
      description: "$2 off on any combo meal",
      type: "fixed",
      used: false,
      minOrder: 10,
    },
    {
      id: "v7",
      code: "DESSERT30",
      discount: "30%",
      validUntil: "2025-06-30",
      description: "30% off on all desserts",
      type: "percentage",
      used: false,
      minOrder: 10,
    },
    {
      id: "v8",
      code: "FREECOKE",
      discount: "Free Drink",
      validUntil: "2025-05-25",
      description: "Free soft drink with any meal purchase",
      type: "freeItem",
      used: false,
      minOrder: 12,
    },
    {
      id: "v9",
      code: "WEEKEND20",
      discount: "20%",
      validUntil: "2025-07-01",
      description: "20% off on weekend orders",
      type: "percentage",
      used: false,
      minOrder: 20,
    },
    {
      id: "v10",
      code: "FAMILYBOX",
      discount: "15%",
      validUntil: "2025-06-15",
      description: "15% off on family box orders",
      type: "percentage",
      used: true,
      minOrder: 30,
    },
  ])

  const [activeTab, setActiveTab] = useState<"active" | "used">("active")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
    })
  }, [])

  const getGradientByType = (type: string) => {
    switch (type) {
      case "percentage":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "fixed":
        return "bg-gradient-to-r from-blue-500 to-teal-400"
      case "freeItem":
        return "bg-gradient-to-r from-amber-500 to-orange-500"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-700"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isExpired = (dateString: string) => {
    const today = new Date()
    const expiryDate = new Date(dateString)
    return today > expiryDate
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const filteredVouchers = vouchers.filter(
    (voucher) => (activeTab === "active" && !voucher.used) || (activeTab === "used" && voucher.used),
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
          Your TankFood Vouchers
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Use your exclusive vouchers to enjoy delicious meals at discounted prices
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-6 py-2 rounded-md transition-all duration-300 ${
                activeTab === "active"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Active Vouchers
            </button>
            <button
              onClick={() => setActiveTab("used")}
              className={`px-6 py-2 rounded-md transition-all duration-300 ${
                activeTab === "used"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Used Vouchers
            </button>
          </div>
        </div>

        {/* Vouchers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVouchers.length > 0 ? (
            filteredVouchers.map((voucher) => (
              <motion.div
                key={voucher.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                data-aos="fade-up"
                data-aos-delay={Math.floor(Math.random() * 300)}
                className={`rounded-xl overflow-hidden shadow-lg relative ${
                  voucher.used || isExpired(voucher.validUntil) ? "opacity-70" : ""
                }`}
              >
                <div
                  className={`${getGradientByType(
                    voucher.type,
                  )} p-5 relative overflow-hidden transition-all duration-300 group`}
                >
                  {/* Decorative elements */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-500"></div>

                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-3 py-1 bg-black bg-opacity-30 rounded-full text-sm mb-2">
                        {voucher.type === "percentage"
                          ? "Percentage Discount"
                          : voucher.type === "fixed"
                            ? "Fixed Amount"
                            : "Free Item"}
                      </span>
                      <h3 className="text-2xl font-bold mb-1">{voucher.discount}</h3>
                      <p className="text-white text-opacity-90">{voucher.description}</p>
                    </div>
                    {voucher.used && (
                      <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">Used</span>
                    )}
                    {!voucher.used && isExpired(voucher.validUntil) && (
                      <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">Expired</span>
                    )}
                  </div>

                  {voucher.minOrder && (
                    <p className="text-sm mt-2 text-white text-opacity-80">Min. order: ${voucher.minOrder}</p>
                  )}
                </div>

                <div className="bg-gray-800 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Valid until</p>
                      <p className="font-medium">{formatDate(voucher.validUntil)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="font-medium bg-gray-700 px-3 py-1.5 rounded-lg text-white">{voucher.code}</div>
                      <motion.button
                        onClick={() => handleCopyCode(voucher.code)}
                        disabled={voucher.used || isExpired(voucher.validUntil)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`relative flex items-center justify-center w-10 h-10 rounded-full ${
                          voucher.used || isExpired(voucher.validUntil)
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

        {/* Floating Action Button */}
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  )
}

export default VoucherPrivate