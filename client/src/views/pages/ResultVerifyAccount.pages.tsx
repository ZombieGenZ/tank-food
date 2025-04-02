"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AOS from "aos"
import "aos/dist/aos.css"
import { CheckCircle } from "lucide-react"

const ResultVerifyAccount = () => {
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
          navigate("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Clean up timer on unmount
    return () => clearInterval(timer)
  }, [navigate])

  const handleReturnHome = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-400 via-red-500 to-purple-600">
      <div
        className="max-w-md w-full bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.02] duration-300"
        data-aos="zoom-in"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-90"></div>
          <div className="relative p-6">
            <div
              className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg mb-4"
              data-aos="flip-left"
              data-aos-delay="300"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        <div className="p-6 text-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-800" data-aos="fade-up" data-aos-delay="400">
            Email Verified!
          </h2>
          <p className="text-gray-600 mb-6" data-aos="fade-up" data-aos-delay="500">
            Your email has been successfully verified. You can now enjoy all the delicious offerings from TankFood!
          </p>

          <div className="flex flex-col gap-2" data-aos="fade-up" data-aos-delay="600">
            <button
              onClick={handleReturnHome}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-orange-500/25 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <span className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-20 group-active:opacity-30"></span>
              <span className="relative flex items-center justify-center gap-2">
                <span>Return to Home</span>
                <span className="text-sm">({countdown}s)</span>
              </span>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>

            <div className="text-sm text-gray-500 mt-2 animate-pulse">Auto-redirecting in {countdown} seconds...</div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200" data-aos="fade-up" data-aos-delay="700">
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"
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