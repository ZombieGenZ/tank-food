import React, { useState } from 'react';

const AlertBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSendVerification = (): void => {
    setIsSending(true);
    // Simulating email sending process
    setTimeout(() => {
      setIsSending(false);
    }, 2000);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-orange-100 m-0 to-amber-100 border-l-4 border-orange-500 p-4 flex items-center justify-between w-full shadow-md">
      <div className="flex-1 text-center text-gray-800">
        <span className="font-medium text-orange-700">Xác thực tài khoản của bạn</span>
        <span className="text-gray-700"> | Vui lòng xác thực email để sử dụng đầy đủ tính năng của hệ thống. </span>
        <span className="font-semibold text-orange-700">Kiểm tra hộp thư email của bạn.</span>
      </div>
      <div className="flex items-center">
        <button 
          onClick={handleSendVerification}
          disabled={isSending}
          className="cursor-pointer px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition duration-200 text-sm shadow-md flex items-center"
        >
          {isSending ? (
            <>
              <span className="mr-2">Đang gửi...</span>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </>
          ) : (
            "Gửi lại email xác thực"
          )}
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;