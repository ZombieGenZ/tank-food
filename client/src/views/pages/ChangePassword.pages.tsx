"use client"

import { JSX, useState, useEffect } from "react"
import { useLocation, useNavigate } from 'react-router-dom';
import type { FormEvent } from "react"
import { message } from "antd"
import { RESPONSE_CODE } from "../../constants/responseCode.constants";

interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChangePassword(props: Props): JSX.Element {
  // Form state
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get('token');

  useEffect(() => {
    if(paramValue == null) {
      navigate('/errorpage')
    }

    const body1 = {
      language: null,
      token: paramValue,
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/users/verify-forgot-password-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body1),
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Có lỗi xảy ra")
      }
      return res.json()
    }).then((data) => {
      console.log(data)
      if(data.code == RESPONSE_CODE.VERIFY_FORGOT_PASSWORD_TOKEN_FAILED) {
        navigate('/errorpage')
      }
      if (data.code === RESPONSE_CODE.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESSFUL && data.result == true) {
        messageApi.success(data.message)
      }
    })
  }, [paramValue, messageApi])

  // Initialize animations
  useEffect(() => {
    // Simple fade-in animation for elements with data-animate attribute
    const animatedElements = document.querySelectorAll("[data-animate]")
    animatedElements.forEach((element, index) => {
      setTimeout(
        () => {
          if (element instanceof HTMLElement) {
            element.style.opacity = "1"
            element.style.transform = "translateY(0)"
          }
        },
        100 * (index + 1),
      )
    })

    // Make sure password strength is visible when password changes
    if (newPassword) {
      const strengthElement = document.querySelector(".password-strength")
      if (strengthElement instanceof HTMLElement) {
        strengthElement.style.opacity = "1"
        strengthElement.style.transform = "translateY(0)"
      }
    }
  }, [newPassword])

  // Password strength checker
  useEffect(() => {
    if (newPassword.length === 0) {
      setPasswordStrength(0)
    } else if (newPassword.length < 6) {
      setPasswordStrength(1)
    } else if (newPassword.length < 10) {
      setPasswordStrength(2)
    } else if (/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword)) {
      setPasswordStrength(4)
    } else if (/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) {
      setPasswordStrength(3)
    } else {
      setPasswordStrength(2)
    }
  }, [newPassword])

  

  const handleSubmit = (e: FormEvent) => {
    try {
      props.setLoading(true)
      e.preventDefault()

      if (newPassword !== confirmPassword) {
        setMessage({ type: "error", text: "Xác nhận mật khẩu không trùng khớp" })
        return
      }

      if (passwordStrength < 3) {
        setMessage({ type: "error", text: "Mật khẩu không đủ mạnh" })
        return
      }

      const body = {
        language: null,
        token: paramValue,
        new_password: newPassword,
        confirm_new_password: confirmPassword
      }

      fetch(`${import.meta.env.VITE_API_URL}/api/users/forgot-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => {
        return res.json()
      }).then((data) => {
        if (data.code === RESPONSE_CODE.FORGOT_PASSWORD_SUCCESSFUL) {
          setMessage({ type: "success", text: data.message })
          messageApi.success(data.message)
          .then(() => {
            navigate("/signup")
          })
        } 
        if(data.code == RESPONSE_CODE.FORGOT_PASSWORD_FAILED) {
          setMessage({ type: "error", text: data.message })
          messageApi.error(data.message)
        }
      })

    } catch (error) {
      messageApi.error(String(error))
    } finally {
      setTimeout(() => {
        props.setLoading(false)
        setIsLoading(false)
        setNewPassword("")
        setConfirmPassword("")
        // navigate("/signup")
      }, 2000)
    }
  }

  useEffect(() => {
    console.log(messages);
  }, [messages])

  const getStrengthColor = () => {
    const colors = ["transparent", "#ef4444", "#f97316", "#eab308", "#22c55e"]
    return colors[passwordStrength]
  }

  const getStrengthText = () => {
    const texts = ["", "Weak", "Fair", "Good", "Strong"]
    return texts[passwordStrength]
  }

  return (
    <div className="password-change-container min-h-screen flex items-center justify-center p-4 sm:p-6">
      {contextHolder}
      <div className="background-pattern absolute inset-0 opacity-5"></div>

      <div 
        className="password-card w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300"
        data-animate
      >
        {/* Card Header */}
        <div className="card-header bg-gradient-to-r from-orange-500 to-amber-500 p-4 sm:p-6 text-white">
          <h1 className="card-title text-xl sm:text-2xl font-bold">Thay đổi mật khẩu mới</h1>
          <p className="card-description text-sm sm:text-base opacity-90 mt-1">
            Giữ cho tài khoản của bạn được bảo mật.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card-form p-4 sm:p-6">
          {/* Alert Message */}
          {messages && (
            <div 
              className={`alert mb-4 p-3 rounded-md flex items-center text-sm ${
                messages.type === "success" 
                  ? "bg-green-50 text-green-800 border border-green-200" 
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
              data-animate
            >
              <span className="alert-icon mr-2">
                {messages?.type === "success" ? "✓" : "⚠"}
              </span>
              <span className="alert-text">{messages?.text}</span>
            </div>
          )}

          <div className="form-fields space-y-4">
            {/* New Password Field */}
            <div className="form-group" data-animate>
              <label htmlFor="new-password" className="form-label block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <div className="input-group relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="password-toggle absolute inset-y-0 right-0 px-3 flex items-center"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  <div className={`eye-icon ${showNewPassword ? "eye-open" : "eye-closed"}`}>
                    <div className="eye-outer">
                      <div className="eye-inner"></div>
                    </div>
                    <div className="eye-lash"></div>
                  </div>
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="password-strength mt-3" data-animate>
                  <div className="strength-header flex justify-between items-center mb-1">
                    <span className="strength-label text-xs text-gray-500">Độ mạnh của mật khẩu:</span>
                    <span className={`strength-text text-xs font-medium ${
                      passwordStrength === 1 ? 'text-red-500' :
                      passwordStrength === 2 ? 'text-orange-500' :
                      passwordStrength === 3 ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="strength-meter h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="strength-meter-bar h-full transition-all duration-300"
                      style={{
                        width: `${passwordStrength * 25}%`,
                        backgroundColor: getStrengthColor(),
                      }}
                    ></div>
                  </div>
                  <ul className="password-requirements mt-2 space-y-1 text-xs text-gray-500">
                    <li className={`flex items-center ${newPassword.length >= 8 ? 'text-green-500' : ''}`}>
                      <span className="mr-1">{newPassword.length >= 8 ? "✓" : "○"}</span>
                      Ít nhất 8 ký tự
                    </li>
                    <li className={`flex items-center ${/[A-Z]/.test(newPassword) ? 'text-green-500' : ''}`}>
                      <span className="mr-1">{/[A-Z]/.test(newPassword) ? "✓" : "○"}</span>
                      Bao gồm kỹ tự viết hoa
                    </li>
                    <li className={`flex items-center ${/[0-9]/.test(newPassword) ? 'text-green-500' : ''}`}>
                      <span className="mr-1">{/[0-9]/.test(newPassword) ? "✓" : "○"}</span>
                      Bao gồm số
                    </li>
                    <li className={`flex items-center ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-500' : ''}`}>
                      <span className="mr-1">{/[^A-Za-z0-9]/.test(newPassword) ? "✓" : "○"}</span>
                      Bao gồm ký tự đặc biệt
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group" data-animate>
              <label htmlFor="confirm-password" className="form-label block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <div className="input-group relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle absolute inset-y-0 right-0 px-3 flex items-center"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <div className={`eye-icon ${showConfirmPassword ? "eye-open" : "eye-closed"}`}>
                    <div className="eye-outer">
                      <div className="eye-inner"></div>
                    </div>
                    <div className="eye-lash"></div>
                  </div>
                </button>
              </div>
              {confirmPassword && newPassword && confirmPassword !== newPassword && (
                <p className="password-mismatch mt-1 text-xs text-red-500">Mật khẩu không trùng khớp</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading} 
            className="submit-button w-full mt-6 py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-md hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center"
            data-animate
          >
            {isLoading ? (
              <div className="button-content flex items-center">
                <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Đang cập nhật...</span>
              </div>
            ) : (
              <div className="button-content flex items-center">
                <span>Đặt lại mật khẩu</span>
                <span className="arrow-icon ml-2 animate-pulse">→</span>
              </div>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="footer absolute bottom-4 right-4 text-xs text-gray-500" data-animate>
        TankFood © {new Date().getFullYear()}
      </div>

      {/* Eye Icon Animation Styles */}
      <style >{`
        .eye-icon {
          position: relative;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .eye-outer {
          width: 18px;
          height: 18px;
          border: 2px solid currentColor;
          border-radius: 75% 15%;
          transform: rotate(45deg);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .eye-inner {
          width: 8px;
          height: 8px;
          background-color: currentColor;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .eye-lash {
          position: absolute;
          width: 24px;
          height: 2px;
          background-color: currentColor;
          transform: rotate(45deg) scaleX(0);
          transform-origin: center;
          transition: transform 0.3s ease;
        }

        .eye-closed .eye-outer {
          height: 2px;
          border-radius: 0;
          border-width: 0;
          border-bottom-width: 2px;
        }

        .eye-closed .eye-inner {
          transform: scale(0);
        }

        .eye-closed .eye-lash {
          transform: rotate(45deg) scaleX(1);
        }

        /* Animation for elements with data-animate */
        [data-animate] {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        /* Background pattern animation */
        .background-pattern {
          background-image: radial-gradient(#f59e0b 0.5px, transparent 0.5px);
          background-size: 15px 15px;
          animation: patternMove 60s linear infinite;
        }

        @keyframes patternMove {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 1000px 1000px;
          }
        }
      `}</style>
    </div>
  )
}