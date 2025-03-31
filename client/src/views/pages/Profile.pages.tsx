"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"info" | "history">("info")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
  })
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  // Sample order data
  const orders = [
    {
      id: "TF-2025",
      date: "15/3/2025",
      items: [
        { name: "Hamburger bò phô mai", quantity: 1, price: 59000 },
        { name: "Coca Cola (size L)", quantity: 1, price: 20000 },
      ],
      total: 90000,
      status: "Đã giao",
    },
    {
      id: "TK-2025",
      date: "17/3/2025",
      items: [
        { name: "Hamburger cá Saba lá chanh", quantity: 1, price: 99000 },
        { name: "Pepsi (size L)", quantity: 1, price: 20000 },
      ],
      total: 130000,
      status: "Đã giao",
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    alert("Thông tin đã được lưu thành công!")
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
            <div className="text-4xl font-bold">12</div>
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
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ giao hàng
                </label>
                <div className="relative">
                  <motion.input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput("address")}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300 outline-none
                      ${
                        focusedInput === "address"
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-300"
                      }`}
                  />
                  {focusedInput === "address" && (
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500"
                    />
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh
                </label>
                <div className="relative">
                  <motion.input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput("birthday")}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300 outline-none
                      ${
                        focusedInput === "birthday"
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-300"
                      }`}
                  />
                  {focusedInput === "birthday" && (
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
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
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
                      <h3 className="font-medium">Đơn hàng #{order.id}</h3>
                      <p className="text-sm text-gray-500">Ngày đặt: {order.date}</p>
                    </div>
                    <motion.div
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "#DEF7EC",
                        transition: { duration: 0.2 },
                      }}
                    >
                      {order.status}
                    </motion.div>
                  </div>

                  <div className="space-y-2 mb-3 relative z-10">
                    {order.items.map((item, i) => (
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
                        <span>1x {item.name}</span>
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
                    <span>Tổng tiền: {order.total.toLocaleString()}đ</span>
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