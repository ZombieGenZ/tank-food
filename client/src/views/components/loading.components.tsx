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

