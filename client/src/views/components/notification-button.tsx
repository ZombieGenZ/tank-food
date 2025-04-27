// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

"use client"

import { useState, useEffect, useRef } from "react"
import { Bell } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

interface Notification {
  notifications: string[]
}

export default function NotificationButton({ notifications = [] }: Notification) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const aosInitialized = useRef(false)

  useEffect(() => {
    if (!aosInitialized.current) {
      AOS.init({
        duration: 1000,
        once: true,
        offset: 5,
      })
      aosInitialized.current = true
    }

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
        <Bell className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-all duration-300" />
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs rounded-full">
          {notifications.length}
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

          <div className="max-h-80 overflow-y-auto" >
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-4 border-b border-gray-100 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
                  data-aos="fade-up"
                  data-aos-delay={100 * (index + 1)}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-500 text-lg">🍔</span>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm">{notification}</p>
                  </div>
                  <div className="absolute right-4 top-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                Không có thông báo mới
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
