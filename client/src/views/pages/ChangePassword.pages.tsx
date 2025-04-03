"use client"

import { JSX, useState, useEffect } from "react"
import type { FormEvent } from "react"

interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChangePassword(props: Props): JSX.Element {
  // Form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)

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
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match" })
      return
    }

    if (passwordStrength < 3) {
      setMessage({ type: "error", text: "Password is not strong enough" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setMessage({ type: "success", text: "Password changed successfully!" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }, 1500)
  }

  const getStrengthColor = () => {
    const colors = ["transparent", "#ef4444", "#f97316", "#eab308", "#22c55e"]
    return colors[passwordStrength]
  }

  const getStrengthText = () => {
    const texts = ["", "Weak", "Fair", "Good", "Strong"]
    return texts[passwordStrength]
  }

  return (
    <div className="password-change-container">
      <div className="background-pattern"></div>

      <div className="password-card" data-animate>
        <div className="card-header">
          <h1 className="card-title">Change Your Password</h1>
          <p className="card-description">Keep your TankFood account secure</p>
        </div>

        <form onSubmit={handleSubmit} className="card-form">
          {message && (
            <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`} data-animate>
              <span className="alert-icon">{message.type === "success" ? "✓" : "⚠"}</span>
              <span className="alert-text">{message.text}</span>
            </div>
          )}

          <div className="form-fields">
            <div className="form-group" data-animate>
              <label htmlFor="current-password" className="form-label">
                Current Password
              </label>
              <div className="input-group">
                <input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="password-toggle"
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  <div className={`eye-icon ${showCurrentPassword ? "eye-open" : "eye-closed"}`}>
                    <div className="eye-outer">
                      <div className="eye-inner"></div>
                    </div>
                    <div className="eye-lash"></div>
                  </div>
                </button>
              </div>
            </div>

            <div className="form-group" data-animate>
              <label htmlFor="new-password" className="form-label">
                New Password
              </label>
              <div className="input-group">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="password-toggle"
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

              {newPassword && (
                <div className="password-strength visible-strength" data-animate>
                  <div className="strength-header">
                    <span className="strength-label">Password strength:</span>
                    <span className={`strength-text strength-${passwordStrength}`}>{getStrengthText()}</span>
                  </div>
                  <div className="strength-meter">
                    <div
                      className="strength-meter-bar"
                      style={{
                        width: `${passwordStrength * 25}%`,
                        backgroundColor: getStrengthColor(),
                      }}
                    ></div>
                  </div>
                  <ul className="password-requirements">
                    <li className={newPassword.length >= 8 ? "requirement-met" : ""}>
                      <span>{newPassword.length >= 8 ? "✓" : "○"}</span>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? "requirement-met" : ""}>
                      <span>{/[A-Z]/.test(newPassword) ? "✓" : "○"}</span>
                      Contains uppercase letter
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? "requirement-met" : ""}>
                      <span>{/[0-9]/.test(newPassword) ? "✓" : "○"}</span>
                      Contains number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(newPassword) ? "requirement-met" : ""}>
                      <span>{/[^A-Za-z0-9]/.test(newPassword) ? "✓" : "○"}</span>
                      Contains special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="form-group" data-animate>
              <label htmlFor="confirm-password" className="form-label">
                Confirm New Password
              </label>
              <div className="input-group">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
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
                <p className="password-mismatch">Passwords don't match</p>
              )}
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="submit-button" data-animate>
            {isLoading ? (
              <div className="button-content">
                <div className="spinner"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="button-content">
                <span>Update Password</span>
                <span className="arrow-icon">→</span>
              </div>
            )}
          </button>
        </form>
      </div>

      <div className="footer" data-animate>
        TankFood © {new Date().getFullYear()}
      </div>

      <style>{`
        /* Container and background */
        .password-change-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          position: relative;
          background: linear-gradient(to bottom right, #fef3c7, #fff7ed, #fef9c3);
        }
        
        .background-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-size: 500px;
          background-repeat: repeat;
        }
        
        /* Card styling */
        .password-card {
          width: 100%;
          max-width: 28rem;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          background-color: white;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .card-header {
          background: linear-gradient(to right, #f97316, #f59e0b);
          padding: 1.5rem;
          color: white;
        }
        
        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }
        
        .card-description {
          margin-top: 0.25rem;
          opacity: 0.8;
          font-size: 0.875rem;
        }
        
        .card-form {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        /* Form elements */
        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        
        .input-group {
          position: relative;
          display: flex;
        }
        
        .form-input {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
          transform: translateY(-1px);
        }

        .input-group:hover .form-input {
          border-color: #f59e0b;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transform: translateY(-1px);
        }
        
        /* Animated eye icon */
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

        .password-toggle {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          padding: 0 0.75rem;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          transition: all 0.3s ease;
        }

        .password-toggle:hover {
          color: #f59e0b;
          transform: scale(1.1);
        }

        .password-toggle:hover .eye-icon {
          transform: scale(1.1);
        }

        .password-toggle:active .eye-icon {
          transform: scale(0.9);
        }
        
        /* Password strength */
        .password-strength {
          margin-top: 0.5rem;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .visible-strength {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .strength-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        
        .strength-label {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .strength-text {
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .strength-1 { color: #ef4444; }
        .strength-2 { color: #f97316; }
        .strength-3 { color: #eab308; }
        .strength-4 { color: #22c55e; }
        
        .strength-meter {
          height: 0.375rem;
          background-color: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
        }
        
        .strength-meter-bar {
          height: 100%;
          transition: width 0.5s ease-out, background-color 0.5s ease;
        }
        
        .password-requirements {
          margin-top: 0.5rem;
          padding-left: 0;
          list-style: none;
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .password-requirements li {
          display: flex;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        
        .password-requirements li span {
          margin-right: 0.25rem;
        }
        
        .requirement-met {
          color: #22c55e;
        }
        
        .password-mismatch {
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
        
        /* Alert */
        .alert {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .alert-success {
          background-color: #f0fdf4;
          color: #166534;
          border: 1px solid #dcfce7;
        }
        
        .alert-error {
          background-color: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fee2e2;
        }
        
        .alert-icon {
          margin-right: 0.5rem;
        }
        
        /* Submit button */
        .submit-button {
          background: linear-gradient(to right, #f59e0b, #f97316);
          color: white;
          border: none;
          border-radius: 0.375rem;
          padding: 0.75rem 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          opacity: 0;
          transform: translateY(10px);
          position: relative;
          overflow: hidden;
        }

        .submit-button:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transition: all 0.6s ease;
        }

        .submit-button:hover {
          background: linear-gradient(to right, #d97706, #ea580c);
          transform: scale(1.03) translateY(-2px);
          box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        }

        .submit-button:hover:before {
          left: 100%;
        }

        .submit-button:active {
          transform: scale(0.98) translateY(0);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .arrow-icon {
          margin-left: 0.5rem;
          animation: pulse-move 1.5s infinite;
          display: inline-block;
        }

        @keyframes pulse-move {
          0%, 100% { 
            opacity: 1;
            transform: translateX(0);
          }
          50% { 
            opacity: 0.6;
            transform: translateX(3px);
          }
        }
        
        /* Footer */
        .footer {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          font-size: 0.75rem;
          color: #6b7280;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
      `}</style>
    </div>
  )
}