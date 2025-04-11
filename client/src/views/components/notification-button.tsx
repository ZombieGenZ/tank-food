"use client"

import { useState, useEffect, useRef } from "react"
import { Bell } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    })

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative cursor-pointer" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        onClick={toggleDropdown}
        className="relative cursor-pointer w-8 h-8 md:w-11 md:h-11 flex items-center justify-center bg-transparent rounded-full shadow-lg group"
        data-aos="zoom-in"
      >
        <Bell className="w-6 h-6 text-blue-500 group-hover:text-blue-600 transition-all duration-300" />
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full transform scale-100 animate-pulse">
          2
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
          data-aos="fade-down"
          data-aos-duration="400"
        >
          <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
            <h3 className="text-blue-700 font-semibold" data-aos="fade-right" data-aos-delay="100">
              Thông báo
            </h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            <div
              className="flex gap-3 p-4 border-b border-gray-100 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-500 text-lg">🍔</span>
              </div>
              <div>
                <p className="text-gray-700 font-medium text-sm">Đơn hàng của bạn đã được xác nhận</p>
                <p className="text-gray-500 text-sm mt-1">2 phút trước</p>
              </div>
              <div className="absolute right-4 top-4 w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
