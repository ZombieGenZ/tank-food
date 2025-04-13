import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import io from "socket.io-client";
import { useEffect, useState, JSX } from "react";
import Verify from '../components/VerifyToken.components';

const socket = io(import.meta.env.VITE_API_URL)

interface NotificationProps {
  notification: string[],
  setNotification: React.Dispatch<React.SetStateAction<string[]>>
}

interface Products {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderInformation {
  account_name: string;
  account_no: string;
  bank_id: string;
  distance: number;
  fee: number;
  order_id: string;
  payment_qr_url: string;
  product: Products[];
  total_bill: number;
  total_price: number;
  total_quantity: number;
  vat: number;
}

interface ApiResponse {
  infomation: OrderInformation;
  message: string;
  code: string,
}


interface PaymentPopupProps {
  userBill: ApiResponse,
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({ userBill }) => {

  function formatCurrency(amount: number, currencyCode = 'vi-VN', currency = 'VND') {
    const formatter = new Intl.NumberFormat(currencyCode, {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(amount);
  }

  return (
    <div className="bg-opacity-70 min-h-full flex">
      <div className="bg-white shadow-2xl flex flex-col lg:flex-row w-full">
        {/* Left Section - Order Info */}
        <div className="w-full lg:w-2/5 p-4 md:p-6 lg:p-8 bg-white">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 border-b pb-2 md:pb-3">
            Thông tin đơn hàng
          </h2>
          <div className="border-b border-gray-200 pb-3 md:pb-4 mb-4 md:mb-5 hover:bg-orange-50 transition duration-300 rounded p-2">
            <p className="text-gray-500 text-xs md:text-sm mb-1">Chủ tài khoản</p>
            <p className="font-medium text-sm md:text-base uppercase">{userBill.infomation.account_name}</p>
          </div>
          <div className="border-b border-gray-200 pb-3 md:pb-4 mb-4 md:mb-5 hover:bg-orange-50 transition duration-300 rounded p-2">
            <p className="text-gray-500 text-xs md:text-sm mb-1">Số tài khoản</p>
            <p className="font-medium text-sm md:text-base text-orange-600">{userBill.infomation.account_no}</p>
          </div>
          <div className="border-b border-gray-200 pb-3 md:pb-4 mb-4 md:mb-5 hover:bg-orange-50 transition duration-300 rounded p-2">
            <p className="text-gray-500 text-xs md:text-sm mb-1">Ngân hàng thụ hưởng</p>
            <p className="font-medium text-sm md:text-base">{userBill.infomation.bank_id}</p>
          </div>
          <div className="border-b border-gray-200 pb-3 md:pb-4 mb-4 md:mb-5">
            <p className="text-gray-500 text-xs md:text-sm mb-1">Số tiền</p>
            <p className="font-bold text-lg md:text-xl text-orange-600">{formatCurrency(userBill.infomation.total_bill)}</p>
          </div>
          <div className="bg-orange-50 p-3 md:p-4 rounded-lg border border-orange-100 mb-4 md:mb-6 shadow-sm">
            <p className="text-gray-600 text-xs md:text-sm mb-1">Nội dung chuyển tiền</p>
            <p className="font-medium text-orange-600 text-base md:text-lg" style={{ wordWrap: 'break-word' }}>
              {userBill.infomation.order_id}
            </p>
          </div>
        </div>

        {/* Right Section - QR Code */}
        <div className="w-full lg:w-3/5 bg-gradient-to-br from-orange-500 to-orange-600 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-start relative">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6 lg:mb-8 text-center">
            Quét mã QR để thanh toán
          </h2>
          <div className="bg-white rounded-xl p-3 md:p-4 mb-4 md:mb-6 w-full max-w-xs shadow-xl">
            <img 
              src={userBill.infomation.payment_qr_url || "/api/placeholder/60/30"} 
              alt="QR Code" 
              className="w-full h-auto" 
            />
          </div>
          <p className="text-center text-xs md:text-sm text-gray-200">
            Quét mã để thanh toán nhanh chóng
          </p>
        </div>
      </div>
    </div>
  );
};

const OrderPageWithPayment = ({ notification, setNotification }: NotificationProps): JSX.Element => {
    const location = useLocation();
    const userBill: ApiResponse = location.state;
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();
    const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
    const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token")); 
    const language = (): string => {
      const Language = localStorage.getItem('language')
      return Language ? JSON.parse(Language) : "Tiếng Việt"
    }

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
      socket.emit('connect-payment-realtime', userBill.infomation.order_id)
      socket.on('payment_notification', (message) => {
        messageApi.open({
          type: 'info',
          content: message,
          duration: 5,
        });
        setNotification([...notification, message])
        checkTokenRouter("/")
      })
      return () => {
        socket.off('payment_notification');
      };
    })
    
    return (
      <div className="p-8 bg-gray-100 min-h-[100vh] flex flex-col items-center justify-center">
        {contextHolder}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Xem thông tin chuyển khoản và thanh toán dưới đây</h1>
        
        {userBill && <PaymentPopup userBill={userBill}/>}
      </div>
    );
  };
  
  export default OrderPageWithPayment;