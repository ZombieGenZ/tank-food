"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Truck, User, Check } from 'lucide-react'
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

    return (
        <div className="w-full my-4 px-2" data-aos="fade-up">
            <div className="relative">
                {/* Main Timeline Line */}
                <div className="absolute top-7 left-0 right-0 h-1 bg-gray-200"></div>

                {/* Active Timeline */}
                <motion.div
                    className="absolute top-7 left-0 h-1 bg-gradient-to-r from-green-400 to-green-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(100, (currentStatus / 3) * 100)}%` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                ></motion.div>

                {/* Timeline Steps */}
                <div className="flex justify-between relative">
                    {steps.map((step, index) => {
                        const isActive = index < currentStatus
                        const isCurrent = index === currentStatus - 1

                        return (
                            <div key={index} className="flex flex-col items-center relative z-10">
                                <motion.div
                                    className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2
                                        ${isActive || isCurrent
                                            ? 'border-green-500 bg-white text-green-500'
                                            : 'border-gray-300 bg-white text-gray-400'}`}
                                    whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(34, 197, 94, 0.4)" }}
                                    data-aos="zoom-in"
                                    data-aos-delay={index * 100}
                                >
                                    {isActive ? (
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

                                    {/* Pulsing animation for current step */}
                                    {isCurrent && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-2 border-green-500"
                                            initial={{ scale: 1, opacity: 1 }}
                                            animate={{ scale: 1.5, opacity: 0 }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    )}
                                </motion.div>

                                <motion.div
                                    className="mt-2 text-center"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 150}
                                >
                                    <p className={`font-medium text-sm ${isActive || isCurrent ? 'text-green-600' : 'text-gray-500'}`}>
                                        {step.title}
                                    </p>
                                    <p className={`text-xs ${isActive || isCurrent ? 'text-green-600' : 'text-gray-500'}`}>
                                        {step.subtitle}
                                    </p>
                                    <p className={`text-xs mt-1 ${isActive || isCurrent ? 'text-gray-700' : 'text-gray-400'}`}>
                                        {step.date || ' '}
                                    </p>
                                </motion.div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default OrderTrackingSteps