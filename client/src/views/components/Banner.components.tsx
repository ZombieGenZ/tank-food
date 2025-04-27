// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import React, { useState } from 'react';
import { message } from 'antd';
import Verify from './VerifyToken.components';
import { RESPONSE_CODE } from '../../constants/responseCode.constants';

interface AlertBannerProps {
  refresh_token: string;
  access_token: string;
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlertBanner: React.FC<AlertBannerProps> = (token) => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const language = (): string => {
    const language = localStorage.getItem('language')
    return language ? JSON.parse(language) : "Tiếng Việt"
  }

  const handleSendVerification = (): void => {
    try {
      token.setLoading(true)
      setIsSending(true);
      const checkToken = async () => {
        const isValid = await Verify(token.refresh_token, token.access_token);
        if (isValid) {
          const body = {
            language: null,
            refresh_token: token.refresh_token
          }

          fetch(`${import.meta.env.VITE_API_URL}/api/users/send-email-verify`, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.access_token}`,
            },
            body: JSON.stringify(body)
          }).then((response) => {
            return response.json()
          }).then((data) => {
            if(data.code == RESPONSE_CODE.SEND_EMAIL_VERIFY_FAILED) {
              messageApi.error(data.message)
            }
            if(data.code == RESPONSE_CODE.SEND_EMAIL_VERIFY_SUCCESSFUL) {
              messageApi.success(`${data.message}, vui lòng kiểm tra hòm thư của bạn !`)
            }
          })
        } else {
          messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
      };
          
      checkToken();
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: String(error),
        style: {
          marginTop: '10vh',
        },
      })
      return;
    } finally {
      setTimeout(() => {
        setIsSending(false);
        token.setLoading(false)
      }, 5000)
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-orange-100 m-0 to-amber-100 border-l-4 border-orange-500 p-4 flex items-center justify-between w-full shadow-md">
      {contextHolder}
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