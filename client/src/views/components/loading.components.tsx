"use client"

import type React from "react"
import "./loading.css"

interface LoadingProps {
  isLoading?: boolean
}

const Loading: React.FC<LoadingProps> = ({ isLoading = true }) => {
  if (!isLoading) return null

  return (
    <>
        <style>{`
          .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(3px);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }

            .spinner {
                width: 60px;
                height: 60px;
                position: relative;
            }

            .double-bounce1,
            .double-bounce2 {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #333;
                opacity: 0.6;
                position: absolute;
                top: 0;
                left: 0;

            -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
            animation: sk-bounce 2.0s infinite ease-in-out;
            }

            .double-bounce2 {
            -webkit-animation-delay: -1.0s;
            animation-delay: -1.0s;
            }

            @-webkit-keyframes sk-bounce {
            0%,
            100% {
                -webkit-transform: scale(0.0);
            }
            50% {
                -webkit-transform: scale(1.0);
            }
            }

            @keyframes sk-bounce {
            0%,
            100% {
                transform: scale(0.0);
                -webkit-transform: scale(0.0);
            }
            50% {
                transform: scale(1.0);
                -webkit-transform: scale(1.0);
            }
            }
        `}</style>
        <div className="loading-overlay">
        <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
        </div>
        </div>
    </>
  )
}

export default Loading

