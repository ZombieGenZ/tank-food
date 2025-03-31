import React, { useState, useEffect } from 'react';
import { Input, message ,Modal } from 'antd';
import { RESPONSE_CODE } from "../../constants/responseCode.constants";
import Verify from '../components/VerifyToken.components';

interface Order {
    _id: string;
    canceled_at: string;
    canceled_by: string | null;
    cancellation_reason: string | null;
    completed_at: string;
    confirmmed_at: string;
    created_at: string;
    delivered_at: string;
    delivering_at: string;
    delivery_address: string | null;
    delivery_latitude: number | null;
    delivery_longitude: number | null;
    delivery_nation: string | null;
    delivery_type: number | null;
    discount_code: string | null;
    distance: number | null;
    email: string | null;
    estimated_time: string | null;
    fee: number;
    is_first_transaction: boolean;
    moderated_by: string;
    name: string | null;
    node: string;
    order_status: number;
    payment_status: number;
    payment_type: number;
    phone: string | null;
    product: Product[];
    receiving_address: string | null;
    receiving_latitude: number | null;
    receiving_longitude: number | null;
    receiving_nation: string | null;
    shipper: string | null;
    suggested_route: string | null;
    total_bill: number;
    total_price: number;
    total_quantity: number;
    updated_at: string;
    user: string | null;
    vat: number;
    address: string,
  }

interface Product {
    availability: string;
    category: Category;
    created_at: string;
    description_translate_1: string;
    description_translate_1_language: string;
    description_translate_2: string;
    description_translate_2_language: string;
    preview: Preview;
    price: string;
    product_id: string;
    quantity: number;
    title_translate_1: string;
    title_translate_1_language: string;
    title_translate_2: string;
    title_translate_2_language: string;
    updated_at: string;
    _id: string;
}

interface Category {
    category_name_translate_1: string;
    category_name_translate_2: string;
    created_at: string;
    index: number;
    translate_1_language: string;
    translate_2_language: string;
    updated_at: string;
    _id: string;
}

interface Preview {
    path: string;
    size: number;
    type: string;
    url: string;
}

const OrderManagement: React.FC = () => {
  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [waitData, setWaitData] = useState<Order[]>([])
  const [doneData, setDoneData] = useState<Order[]>([])
  const [messageApi, contextHolder] = message.useMessage();

  const [showreasonmodal, setShowreasonmodal] = useState<boolean>(false);
  const [selectID, setSelectID] = useState<string|null>(null)
  const [reasonRejection, setReason] = useState<string>("")

  const [showCancelmodal, setShowcancelmodal] = useState<boolean>(false);
  const [reasonCancelation, setReasonCancel] = useState<string>("")

  const showModalReject = (orderID: string) => {
    setShowreasonmodal(true)
    setSelectID(orderID)
}

const showModalCancel = (orderID: string) => {
    setShowcancelmodal(true)
    setSelectID(orderID)
}

const handleConfirm = (orderID: string) => {
    const checkToken = async () => {
        const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
            const body = {
                language: null,
                refresh_token: refresh_token,
                order_id: orderID            
            }
        
            fetch(`${import.meta.env.VITE_API_URL}/api/orders/payment-confirmation`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify(body)
            }).then((response) => {
                return response.json()
            }).then((data) => {
                console.log(data)
                if(data.code == RESPONSE_CODE.PAYMENT_CONFIRMATION_SUCCESSFUL) {
                    messageApi.success(data.message)
                    const body = {
                        language: null,
                        refresh_token: refresh_token,
                    }
                    fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-employee`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${access_token}`,
                        },
                        body: JSON.stringify(body)
                    }).then(response => {
                        return response.json()
                    }).then((data) => {
                        setWaitData(data.order)
                        console.log(data)
                    })
        
                    fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-employee`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${access_token}`,
                        },
                        body: JSON.stringify(body)
                    }).then(response => {
                        return response.json()
                    }).then((data) => {
                        setDoneData(data.order)
                        console.log(data)
                    })
                } else {
                    messageApi.error(data.errors.order_id.msg)
                    return
                }
            })  
        } else {
            messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
    };
  checkToken();
}


const handleCancel = (orderID: string) => {
    if(!orderID) {
        messageApi.error("Mã id không hợp lệ")
        return;
    }
    const checkToken = async () => {
          const isValid = await Verify(refresh_token, access_token);
          if (isValid) {
            const body = {
                language: null,
                refresh_token: refresh_token,
                order_id: orderID,
                reason: reasonCancelation,
            }
        
            fetch(`${import.meta.env.VITE_API_URL}/api/orders/cancel-order-employee`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify(body)
            }).then(response => {
                return response.json()
            }).then((data) => {
                console.log(data)
                if(data.code){
                    setShowcancelmodal(false)
                    messageApi.success(data.message)
                    const body = {
                        language: null,
                        refresh_token: refresh_token,
                    }
                    fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-employee`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${access_token}`,
                        },
                        body: JSON.stringify(body)
                    }).then(response => {
                        return response.json()
                    }).then((data) => {
                        setWaitData(data.order)
                        console.log(data)
                    })
        
                    fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-employee`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${access_token}`,
                        },
                        body: JSON.stringify(body)
                    }).then(response => {
                        return response.json()
                    }).then((data) => {
                        setDoneData(data.order)
                        console.log(data)
                    })
                } else {
                    messageApi.error(data.errors.order_id.msg)
                    return
                }
            })   
          } else {
              messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
          }
      };
    checkToken();
}

const handleReject = (orderID: string) => {
    if(!orderID) {
        messageApi.error("Mã id không hợp lệ")
        return;
    }

    const checkToken = async () => {
        const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
            const body = {
                language: null,
                refresh_token: refresh_token,
                order_id: orderID,
                decision: false,
                reason: reasonRejection,
            }
        
            fetch(`${import.meta.env.VITE_API_URL}/api/orders/order-approval`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify(body)
            }).then(response => {
                return response.json()
            }).then((data) => {
                console.log(data)
                if(data.code == RESPONSE_CODE.ORDER_APPROVAL_SUCCESSFUL){
                    messageApi.success(data.message)
                    const body = {
                        language: null,
                        refresh_token: refresh_token,
                    }
                    fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-employee`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${access_token}`,
                        },
                        body: JSON.stringify(body)
                    }).then(response => {
                        return response.json()
                    }).then((data) => {
                        setWaitData(data.order)
                        console.log(data)
                    })
        
                    fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-employee`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${access_token}`,
                        },
                        body: JSON.stringify(body)
                    }).then(response => {
                        return response.json()
                    }).then((data) => {
                        setDoneData(data.order)
                        console.log(data)
                    })
                } else {
                    messageApi.error(data.errors.order_id.msg)
                    return
                }
            })  
        } else {
            messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
    };
    checkToken();
}


  useEffect(() => {
    console.log(waitData)
    console.log(doneData)
  }, [waitData, doneData])

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

  useEffect(() => {
    const body = {
        language: null,
        refresh_token: refresh_token,
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-employee`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(body)
    }).then(response => {
        return response.json()
    }).then((data) => {
        if(data.code == RESPONSE_CODE.GET_ORDER_SUCCESSFUL) {
            messageApi.success(data.message)
            setWaitData(data.order.map((order: Order) => ({...order, address: order.delivery_type == 0 ? "Tại quầy" : order.receiving_address})))
        } else {
            messageApi.error(data.message)
            return;
        }
    })

    fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-employee`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(body)
    }).then(response => {
        return response.json()
    }).then((data) => {
        if(data.code  == RESPONSE_CODE.GET_ORDER_SUCCESSFUL) {
            messageApi.success(data.message)
            setDoneData(data.order.map((order: Order) => ({...order, address: order.delivery_type == 0 ? "Tại quầy" : order.receiving_address})))
        } else {
            messageApi.error(data.message)
            return;
        }
    })
}, [refresh_token, access_token])

  const [activeTab, setActiveTab] = useState<'pending' | 'processed'>('pending');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const toggleProducts = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const renderPendingOrder = (order: Order) => {
    const isPickup = order.address === "Tại quầy";

    return (
      <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden mb-4 hover:shadow-lg transition">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Đơn hàng #{order._id}</h3>
              <p className="text-gray-500 text-sm">{order.created_at}</p>
            </div>
            <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
              Ch  Chờ duyệt
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">Khách hàng</p>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 text-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <p className="font-medium">{order.name}</p>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">Số điện thoại</p>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 text-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <p className="font-medium">{order.phone}</p>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">Địa chỉ</p>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 text-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <p className="font-medium">{order.address}</p>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">Tổng tiền</p>
              <p className="font-bold text-xl text-orange-600">{String(order.total_bill).toLocaleString()}đ</p>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">Hình thức thanh toán</p>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 text-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </div>
                <p className="font-medium">{order.payment_type == 0 ? "Tiền mặt" : "Chuyển khoản"}</p>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">Trạng thái thanh toán</p>
              <div className="flex items-center">
                <div className={`w-6 h-6 mr-2 ${order.payment_status == 1 ? 'text-green-500' : 'text-red-500'}`}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    {order.payment_status == 1 ? (
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    ) : (
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                    )}
                  </svg>
                </div>
                <p className={`font-medium ${order.payment_status == 1 ? 'text-green-600' : 'text-red-600'}`}>
                  {order.payment_status == 1 ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600 text-sm font-medium">Danh sách sản phẩm</p>
              <button
                onClick={() => toggleProducts(order._id)}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center"
              >
                {expandedOrders[order._id] ? 'Thu gọn' : 'Xem chi tiết'}
                <svg
                  className={`w-4 h-4 ml-1 transform ${expandedOrders[order._id] ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {expandedOrders[order._id] && order.product.map((product, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center mr-3 text-orange-600">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </div>
                  <span className="font-medium">{product.title_translate_1} (x{product.quantity})</span>
                </div>
                <span className="text-orange-600 font-medium">{product.price.toLocaleString()}đ</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            {isPickup ? (
              <>
                {order.order_status == 0 && order.payment_type == 0 && order.payment_status == 0 ? (
                  <button
                    onClick={() => handleConfirm(order._id)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Xác nhận thanh toán
                  </button>
                ) : (
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Duyệt
                  </button>
                )}
                <button
                  onClick={() => showModalReject(order._id)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Từ chối
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Duyệt
                </button>
                <button
                  onClick={() => showModalCancel(order._id)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Huỷ đơn hàng
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProcessedOrder = (order: Order) => {
    const statusColors: Record<string, string> = {
      "Thành công": "bg-green-100 text-green-600",
      "Duyệt thành công": "bg-green-100 text-green-600",
      "Đang giao": "bg-blue-100 text-blue-600",
      "Thất bại": "bg-red-100 text-red-600"
    };

    return (
      <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Đơn hàng #{order._id}</h3>
              <p className="text-gray-500 text-sm">{order.created_at}</p>
            </div>
            <div className={`${statusColors[order.order_status == 0 ? "Duyệt thành công" : order.order_status == 2 ? "Đang giao" : order.order_status == 4 ? "Thành công" : "Thất bại"]} px-3 py-1 rounded-full text-sm font-medium`}>
              {order.order_status == 0 ? "Duyệt thành công" : order.order_status == 2 ? "Đang giao" : order.order_status == 4 ? "Thành công" : "Thất bại"}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">Khách hàng</p>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 text-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <p className="font-medium">{order.name}</p>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">Số điện thoại</p>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 text-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <p className="font-medium">{order.phone}</p>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">Địa chỉ</p>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 text-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <p className="font-medium">{order.address}</p>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">Tổng tiền</p>
              <p className="font-bold text-xl text-orange-600">{order.total_bill.toLocaleString()}đ</p>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">Hình thức thanh toán</p>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 text-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </div>
                <p className="font-medium">{order.payment_type == 0 ? "Tiền mặt" : "Chuyển khoản"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600 text-sm font-medium">Danh sách sản phẩm</p>
              <button
                onClick={() => toggleProducts(order._id)}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center"
              >
                {expandedOrders[order._id] ? 'Thu gọn' : 'Xem chi tiết'}
                <svg
                  className={`w-4 h-4 ml-1 transform ${expandedOrders[order._id] ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {expandedOrders[order._id] && order.product.map((product, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center mr-3 text-orange-600">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </div>
                  <span className="font-medium">{product.title_translate_1} (x{product.quantity})</span>
                </div>
                <span className="text-orange-600 font-medium">{product.price.toLocaleString()}đ</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {contextHolder}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý đơn đặt hàng</h1>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              className={`pb-3 px-4 text-sm font-medium ${activeTab === 'pending' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('pending')}
            >
              Đơn đang chờ duyệt ({waitData.length})
            </button>
            <button
              className={`pb-3 px-4 text-sm font-medium ${activeTab === 'processed' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('processed')}
            >
              Đơn đã xử lý ({doneData.length})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {activeTab === 'pending' ? (
            waitData.length > 0 ? (
              waitData.map(renderPendingOrder)
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="mt-2 text-gray-500">Không có đơn hàng nào đang chờ duyệt</p>
              </div>
            )
          ) : (
              doneData.length > 0 ? (
              doneData.map(renderProcessedOrder)
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="mt-2 text-gray-500">Không có đơn hàng nào đã xử lý</p>
              </div>
            )
          )}
        </div>
      </div>
      <Modal title={language() == "Tiếng Việt" ? "Lý do từ chối đơn hàng" : "Reasons for order rejection"} onOk={() => handleReject(selectID ? selectID : "")} okText={language() == "Tiếng Việt" ? "Xác nhận" : "Confirm"} open={showreasonmodal} onCancel={() => setShowreasonmodal(false)} onClose={() => setShowreasonmodal(false)}>
        <div className="flex gap-2 flex-col">
            <p>{language() == "Tiếng Việt" ? "Lý do:" : "Reason:"}</p>
            <Input placeholder="Vui lòng nhập lý do cụ thể"
                    value={reasonRejection}
                    onChange={(e) => setReason(e.target.value)}/>
        </div>
      </Modal>

      <Modal title={language() == "Tiếng Việt" ? "Lý do huỷ đơn hàng" : "Reasons for order cancelation"} onOk={() => handleCancel(selectID ? selectID : "")} okText={language() == "Tiếng Việt" ? "Xác nhận" : "Confirm"} open={showCancelmodal} onCancel={() => setShowcancelmodal(false)} onClose={() => setShowcancelmodal(false)}>
        <div className="flex gap-2 flex-col">
            <p>{language() == "Tiếng Việt" ? "Lý do:" : "Reason:"}</p>
            <Input placeholder="Vui lòng nhập lý do cụ thể"
                    value={reasonCancelation}
                    onChange={(e) => setReasonCancel(e.target.value)}/>
        </div>
      </Modal>
    </div>
  );
};

export default OrderManagement;