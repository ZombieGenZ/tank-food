"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Truck, User, Check, X } from 'lucide-react' // Import biểu tượng X
import AOS from "aos"
import "aos/dist/aos.css"

interface OrderTrackingProps {
  currentStatus: number
  timestamps?: {
    created?: string
    delivering?: string
    delivered?: string
  }
}

const OrderTrackingSteps: React.FC<OrderTrackingProps> = ({
  currentStatus = 0,
  timestamps = {}
}) => {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
    })
  }, [])

  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }

  // Format date to Vietnamese style
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${hours}:${minutes} ${day}-${month}-${year}`
  }

  const steps = [
    {
      icon: Package,
      title: language() == "Tiếng Việt" ? "Kho Hàng" : "Warehouse",
      subtitle: language() == "Tiếng Việt" ? "Đã Xác Nhận" : "Confirmed",
      date: formatDate(timestamps.created),
      status: 1,
    },
    {
      icon: Truck,
      title: language() == "Tiếng Việt" ? "Đang Giao" : "Shipping",
      subtitle: language() == "Tiếng Việt" ? "Đơn Hàng" : "Order",
      date: formatDate(timestamps.delivering),
      status: 2,
    },
    {
      icon: User,
      title: language() == "Tiếng Việt" ? "Khách Hàng" : "Customer",
      subtitle: language() == "Tiếng Việt" ? "Đã Nhận Hàng" : "Delivered",
      date: formatDate(timestamps.delivered),
      status: 3,
    },
  ]

  const renderStepIcon = (step: (typeof steps)[number], index: number) => {
    const isActive = index < currentStatus;
    const isCurrent = index === currentStatus - 1;
    const isFailed = currentStatus === 5;
      return(
        <motion.div
            className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2
            ${isFailed
                ? 'border-red-500 bg-white text-red-500'
                : (isActive || isCurrent
                ? 'border-green-500 bg-white text-green-500'
                : 'border-gray-300 bg-white text-gray-400')}`}
            whileHover={{ scale: 1.1, boxShadow: isFailed ? "0 0 15px rgba(220, 38, 38, 0.4)" : "0 0 15px rgba(34, 197, 94, 0.4)" }}
            data-aos="zoom-in"
            data-aos-delay={index * 100}
        >
            {isFailed ? (
            <motion.div
                className="absolute inset-0 bg-red-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <X className="w-6 h-6 text-white" />
            </motion.div>
            ) : isActive ? (
            <motion.div
                className="absolute inset-0 bg-green-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Check className="w-6 h-6 text-white" />
            </motion.div>
            ) : (
            <step.icon className="w-6 h-6" />
            )}
            {/* {isCurrent && !isFailed && (
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-green-500"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
            )} */}
        </motion.div>
      );
    };

  return (
    <div className="w-full my-4 px-2" data-aos="fade-up">
      <div className="relative">
        {/* Main Timeline Line */}
        <div className="absolute top-7 left-0 right-0 h-1 bg-gray-200"></div>

        {/* Active Timeline */}
        <motion.div
          className={`absolute top-7 left-0 h-1 ${currentStatus === 5 ? 'bg-red-500' : 'bg-gradient-to-r from-green-400 to-green-500'}`}
          initial={{ width: "0%" }}
          animate={{ width: `${Math.min(100, (currentStatus / 3) * 100)}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        ></motion.div>

        {/* Timeline Steps */}
        <div className="flex justify-between relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative z-10">
              {renderStepIcon(step, index)}
              <motion.div
                className="mt-2 text-center"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <p className={`font-medium text-sm ${currentStatus === 5 ? 'text-red-600' : (index < currentStatus ? 'text-green-600' : 'text-gray-500')}`}>
                  {step.title}
                </p>
                <p className={`text-xs ${currentStatus === 5 ? 'text-red-600' : (index < currentStatus ? 'text-green-600' : 'text-gray-500')}`}>
                  {step.subtitle}
                </p>
                <p className={`text-xs mt-1 ${currentStatus === 5 ? 'text-gray-700' : (index < currentStatus ? 'text-gray-700' : 'text-gray-400')}`}>
                  {step.date || ' '}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrderTrackingSteps
