// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import { CheckCircle } from "lucide-react"
import Verify from "../components/VerifyToken.components"
import { message } from "antd"
import { RESPONSE_CODE } from "../../constants/responseCode.constants"

const ResultVerifyAccount = () => {
  const language = (): string => {
    const language = localStorage.getItem('language')
    return language ? JSON.parse(language) : "Tiếng Việt"
  }
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get('token');

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

  const checkTokenRouter = (router: string) => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          navigate(router)
        } else {
          messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
    };
    checkToken()
  }

  useEffect(() => {
    if(paramValue == null)
    {
      checkTokenRouter('/errorpage')
    }

    const body = {
      language: null,
      token: paramValue
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/users/verify-email-verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => {
      return response.json()
    }).then(data => {
      console.log(data)
      if(data.code == RESPONSE_CODE.VERIFY_EMAIL_VERIFY_TOKEN_FAILED) {
        checkTokenRouter('/errorpage')
      }
      if (data.code === RESPONSE_CODE.VERIFY_EMAIL_VERIFY_TOKEN_SUCCESSFUL) {
        messageApi.success(data.message)
        const body = {
          language: null,
          token: paramValue
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/users/verify-account`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }).then((response) => {
          return response.json()
        }).then((data) => {
          console.log(data)
        })
      }
    })
  }, [paramValue, messageApi])

  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 100
    })

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          checkTokenRouter("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Clean up timer on unmount
    return () => clearInterval(timer)
  }, [navigate])

  const handleReturnHome = () => {
    checkTokenRouter("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-orange-400 via-red-500 to-purple-600">
      {contextHolder}
      <div
        className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white bg-opacity-90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden transform transition-all hover:scale-[1.02] duration-300"
        data-aos="zoom-in"
      >
        {/* Header with checkmark */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-90"></div>
          <div className="relative p-4 sm:p-6">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-md sm:shadow-lg mb-3 sm:mb-4"
              data-aos="flip-left"
              data-aos-delay="300"
            >
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            {language() == "Tiếng Việt" ? "Email Đã Được Xác Minh!" : "Email Verified!"}
          </h2>
          <p
            className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            {language() == "Tiếng Việt"
              ? "Email của bạn đã được xác minh thành công. Bây giờ bạn có thể tận hưởng tất cả những món ăn ngon từ TankFood!"
              : "Your email has been successfully verified. You can now enjoy all the delicious offerings from TankFood!"}
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-2" data-aos="fade-up" data-aos-delay="600">
            <button
              onClick={handleReturnHome}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 sm:px-6 sm:py-3 text-white shadow-md sm:shadow-lg transition-all duration-300 hover:shadow-orange-500/25 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-sm sm:text-base"
            >
              <span className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-20 group-active:opacity-30"></span>
              <span className="relative flex items-center justify-center gap-2">
                <span>{language() == "Tiếng Việt" ? "Quay về Trang Chủ" : "Return to Home"}</span>
                <span className="text-xs sm:text-sm">({countdown}s)</span>
              </span>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>

            <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 animate-pulse">
              {language() == "Tiếng Việt" ? `Tự động chuyển hướng sau ${countdown} giây...` : `Auto-redirecting in ${countdown} seconds...`}
            </div>
          </div>

          {/* Loading dots */}
          <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-200" data-aos="fade-up" data-aos-delay="700">
            <div className="flex justify-center space-x-2 sm:space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultVerifyAccount