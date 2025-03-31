import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

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
  isOpen: boolean;
  onClose: () => void;
  userBill: ApiResponse,
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({ isOpen, onClose, userBill }) => {
  const [minutes, setMinutes] = useState<number>(10);
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) return;

    const countdown = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else if (minutes > 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          return 59;
        } else {
          clearInterval(countdown);
          onClose()
          return 0;
        }
      });
    }, 1000);

    return () => {clearInterval(countdown)};
  }, [isOpen, minutes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 min-h-full flex justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex overflow-x-auto">
        {/* Left Section - Order Info */}
        <div className="w-2/5 p-8 bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Thông tin đơn hàng
          </h2>
          <div className="border-b border-gray-200 pb-4 mb-5 hover:bg-orange-50 transition duration-300 rounded p-2">
            <p className="text-gray-500 text-sm mb-1">Nhà cung cấp</p>
            <p className="font-medium">DPTCLOUD.VN</p>
          </div>
          <div className="border-b border-gray-200 pb-4 mb-5 hover:bg-orange-50 transition duration-300 rounded p-2">
            <p className="text-gray-500 text-sm mb-1">Chủ tài khoản</p>
            <p className="font-medium uppercase">{userBill.infomation.account_name}</p>
          </div>
          <div className="border-b border-gray-200 pb-4 mb-5 hover:bg-orange-50 transition duration-300 rounded p-2">
            <p className="text-gray-500 text-sm mb-1">Số tài khoản</p>
            <p className="font-medium text-orange-600">{userBill.infomation.account_no}</p>
          </div>
          <div className="border-b border-gray-200 pb-4 mb-5 hover:bg-orange-50 transition duration-300 rounded p-2">
            <p className="text-gray-500 text-sm mb-1">Ngân hàng thụ hưởng</p>
            <p className="font-medium">{userBill.infomation.bank_id}</p>
          </div>
          <div className="border-b border-gray-200 pb-4 mb-5">
            <p className="text-gray-500 text-sm mb-1">Số tiền</p>
            <p className="font-bold text-xl text-orange-600">{userBill.infomation.total_bill.toLocaleString()}đ</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-6 shadow-sm">
            <p className="text-gray-600 text-sm mb-1">Nội dung chuyển tiền</p>
            <p className="font-medium text-orange-600 text-lg">{userBill.infomation.order_id}</p>
          </div>
          <div className="bg-gray-100 p-5 rounded-lg shadow-inner">
            <p className="text-gray-600 text-sm mb-3 font-medium">Đơn hàng sẽ hết hạn sau:</p>
            <div className="flex gap-4 justify-center">
              <div className="text-2xl font-bold text-orange-600">{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</div>
            </div>
          </div>
          <div className="mt-5">
            <button 
              onClick={onClose} 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition w-full shadow-lg hover:shadow-xl">
              Quay về
            </button>
          </div>
        </div>

        {/* Right Section - QR Code */}
        <div className="w-3/5 bg-gradient-to-br h-[110%] from-orange-500 to-orange-600 p-8 flex flex-col items-center justify-start relative">
          <h2 className="text-2xl font-semibold text-white mb-8">Quét mã QR để thanh toán</h2>
          <div className="bg-white rounded-xl p-4 mb-6 w-full max-w-xs shadow-xl">
            <img src={userBill.infomation.payment_qr_url || "/api/placeholder/60/30"} alt="QR Code" className="w-full h-auto" />
          </div>
          <p className="text-center text-sm text-gray-200">Quét mã để thanh toán nhanh chóng</p>
        </div>
      </div>
    </div>
  );
};

const OrderPageWithPayment = () => {
    const [showPayment, setShowPayment] = useState(false);
    const location = useLocation();
    const userBill: ApiResponse = location.state;
    
    return (
      <div className="p-8 bg-gray-100 min-h-[100vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Xem thông tin chuyển khoản và thanh toán dưới đây</h1>
        <button 
          onClick={() => setShowPayment(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Hiển thị popup thanh toán
        </button>
        
        {userBill && (
            <PaymentPopup
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                userBill={userBill}
            />
        )}
      </div>
    );
  };
  
  export default OrderPageWithPayment;