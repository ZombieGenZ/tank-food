// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import React, { useState, useEffect } from 'react';
import { Input, message ,Modal, Grid } from 'antd';
import { RESPONSE_CODE } from "../../constants/responseCode.constants";
import Verify from '../components/VerifyToken.components';
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL)
const { useBreakpoint } = Grid;

interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  aLert: NotificationProps
}

interface NotificationProps {
  addNotification: (message: string) => void;
}

interface Order {
    bill_url: string;
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

const OrderManagement: React.FC<Props> = (props) => {
  const screens = useBreakpoint();
  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));

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
  
  const [waitData, setWaitData] = useState<Order[]>([])
  const [doneData, setDoneData] = useState<Order[]>([])
  const [messageApi, contextHolder] = message.useMessage();

  const [showreasonmodal, setShowreasonmodal] = useState<boolean>(false);
  const [selectID, setSelectID] = useState<string|null>(null)
  const [reasonRejection, setReason] = useState<string>("")

  const [showCancelmodal, setShowcancelmodal] = useState<boolean>(false);
  const [reasonCancelation, setReasonCancel] = useState<string>("")


  useEffect(() => {
    socket.emit('connect-employee-realtime', refresh_token);

    socket.on('create-order', (data) => {
      messageApi.info(language() === "Tiếng Việt" ? "Có đơn hàng mới" : "New order");
      props.aLert.addNotification(language() === "Tiếng Việt" ? "Có đơn hàng mới" : "New order")
      setWaitData((prevData) => [
        ...prevData,
        { ...data, address: data.delivery_type === 0 ? "Tại quầy" : data.receiving_address },
      ]);
    });

    socket.on('checkout-order', (data) => {
      messageApi.info(language() === "Tiếng Việt" ? "Có đơn hàng mới thanh toán thành công" : "New order payment");
      props.aLert.addNotification(language() === "Tiếng Việt" ? "Có đơn hàng mới thanh toán thành công" : "New order payment")
      setWaitData((prevData) =>
        prevData.map((order) => (order._id === data._id ?  data  : order))
      );
    });

    socket.on('payment-confirmation', (data) => {
      messageApi.info(language() === "Tiếng Việt" ? "Đơn hàng đã được xác nhận thanh toán" : "Order has been confirmed");
      props.aLert.addNotification(language() === "Tiếng Việt" ? "Đơn hàng đã được xác nhận thanh toán" : "Order has been confirmed")
      setWaitData((prevData) =>
        prevData.map((order) => (order._id === data._id ? { ...data, address: order.delivery_type == 0 ? "Tại quầy" : order.receiving_address } : order))
      );
    });

    socket.on('approval-order', (data) => {
      messageApi.info(language() === "Tiếng Việt" ? "Đơn hàng đã được duyệt" : "Order has been approved");
      props.aLert.addNotification(language() === "Tiếng Việt" ? "Đơn hàng đã được duyệt" : "Order has been approved")
      setWaitData((prevData) => prevData.filter((order) => order._id !== data._id));
      setDoneData((prevData) => [...prevData, data]); // Thêm đơn hàng vào doneData
    });

    socket.on('cancel-order', (data) => {
      messageApi.info(language() === "Tiếng Việt" ? "Đơn hàng đã bị hủy" : "Order has been canceled");
      props.aLert.addNotification(language() === "Tiếng Việt" ? "Đơn hàng đã bị hủy" : "Order has been canceled")
      setWaitData((prevData) => prevData.filter((order) => order._id !== data._id));
      setDoneData((prevData) =>
          prevData.map((order) => (order._id === data._id ? { ...data, address: order.delivery_type == 0 ? "Tại quầy" : order.receiving_address } : order))
      );
    });

    socket.on('complete-order', (data) => {
      messageApi.info(language() === "Tiếng Việt" ? "Đơn hàng đã hoàn thành" : "Order completed");
      props.aLert.addNotification(language() === "Tiếng Việt" ? "Đơn hàng đã hoàn thành" : "Order completed")
      setDoneData((prevData) =>
        prevData.map((order) => (order._id === data._id ? { ...data, address: order.delivery_type == 0 ? "Tại quầy" : order.receiving_address } : order))
      );
    });

    return () => {
      socket.off('create-order');
      socket.off('checkout-order');
      socket.off('approval-order');
      socket.off('cancel-order');
      socket.off('payment-confirmation');
      socket.off('complete-order');
    };
  }, [refresh_token, messageApi]);

  const showModalReject = (orderID: string) => {
    setShowreasonmodal(true)
    setSelectID(orderID)
}

const showModalCancel = (orderID: string) => {
    setShowcancelmodal(true)
    setSelectID(orderID)
}

const handleConfirmSuccess = (orderId: string) => {
  const checkToken = async () => {
    const isValid = await Verify(refresh_token, access_token);
    if (isValid) {
      try { 
        props.setLoading(true) 
        const body = {
          language: null,
          refresh_token: refresh_token,
          order_id: orderId,
          decision: true,
          reason: null
        }
  
        fetch(`${import.meta.env.VITE_API_URL}/api/orders/order-completion-confirmation`, {
          method: 'PUT',
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(body)
        }).then((response) => {
          return response.json()
        }).then((data) => {
          if(data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
            messageApi.error(data.message)
            if (data.errors) {
              for (const key in data.errors) {
                if (data.errors[key] && data.errors[key].msg) {
                  messageApi.error(data.errors[key].msg);
                }
              }
            }
            return;
          }
          if(data.code == RESPONSE_CODE.ORDER_COMPLETION_CONFIRMATION_SUCCESSFUL){
              messageApi.success(data.message)
          } else {
              messageApi.error(data.errors.order_id.msg)
              return
          }
       })
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
          props.setLoading(false)
        }, 2000)
      }
    } else {
      messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
    }
  };

  checkToken();
}

const handleAproval = (orderId: string) => {
  const checkToken = async () => {
    const isValid = await Verify(refresh_token, access_token);
    if (isValid) {
      try {
        props.setLoading(true)
        const body = {
          language: null,
          refresh_token: refresh_token,
          order_id: orderId,
          decision: true,
          reason: null
        }
  
        fetch(`${import.meta.env.VITE_API_URL}/api/orders/order-approval`, {
          method: 'PUT',
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(body)
        }).then((response) => {
          return response.json()
        }).then((data) => {
          if(data.code == RESPONSE_CODE.ORDER_APPROVAL_FAILED){
            messageApi.error(data.message)
            return
          }
          if(data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
            messageApi.error(data.message)
            if (data.errors) {
              for (const key in data.errors) {
                if (data.errors[key] && data.errors[key].msg) {
                  messageApi.error(data.errors[key].msg);
                }
              }
            }
            return;
          }
          if(data.code == RESPONSE_CODE.ORDER_APPROVAL_SUCCESSFUL){
              messageApi.success(data.message)
          }
      })
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
          props.setLoading(false)
        }, 2000)
      }
    } else {
      messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
    }
  };

  checkToken();
}

const handleConfirm = (orderID: string) => {
    const checkToken = async () => {
        const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          try {
            props.setLoading(true)
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
              if(data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
                messageApi.error(data.message)
                if (data.errors) {
                  for (const key in data.errors) {
                    if (data.errors[key] && data.errors[key].msg) {
                      messageApi.error(data.errors[key].msg);
                    }
                  }
                }
                return;
              }
              if(data.code == RESPONSE_CODE.PAYMENT_CONFIRMATION_SUCCESSFUL) {
                  messageApi.success(data.message)
              } else {
                  messageApi.error(data.errors.order_id.msg)
                  return
              }
            })
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
              props.setLoading(false)
            }, 2000)
          }  
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
        try {
          props.setLoading(true)
          setShowcancelmodal(false)
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
            if(data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
              messageApi.error(data.message)
              if (data.errors) {
                for (const key in data.errors) {
                  if (data.errors[key] && data.errors[key].msg) {
                    messageApi.error(data.errors[key].msg);
                  }
                }
              }
              return;
            }
            if(data.code == RESPONSE_CODE.CANCEL_ORDER_SUCCESSFUL){
                setShowcancelmodal(false)
                messageApi.success(data.message)
            } else {
                messageApi.error(data.errors.order_id.msg)
                return
            }
        })
        }  catch (error) {
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
            props.setLoading(false)
          }, 2000)
        }   
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
          try {
            props.setLoading(true)
            setShowreasonmodal(false)
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
              if(data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
                messageApi.error(data.message)
                if (data.errors) {
                  for (const key in data.errors) {
                    if (data.errors[key] && data.errors[key].msg) {
                      messageApi.error(data.errors[key].msg);
                    }
                  }
                }
                return;
              }
              if(data.code == RESPONSE_CODE.ORDER_APPROVAL_FAILED){
                messageApi.error(data.message)
                return
              }
              if(data.code == RESPONSE_CODE.ORDER_APPROVAL_SUCCESSFUL){
                  messageApi.success(data.message)
              }
            })
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
              props.setLoading(false)
            }, 2000)
          }  
        } else {
            messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
    };
    checkToken();
}

const OpenBillPDF = (link: string) => {
  window.open(link, '_blank');
}

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
            setWaitData(data.order.map((order: Order) => ({...order, address: order.delivery_type == 0 ? "Tại quầy" : order.receiving_address})))
            console.log(data)
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
            setDoneData(data.order.map((order: Order) => ({...order, address: order.delivery_type == 0 ? "Tại quầy" : order.receiving_address})))
        } else {
            messageApi.error(data.message)
            return;
        }
    })
}, [refresh_token, access_token, messageApi])

  const [activeTab, setActiveTab] = useState<'pending' | 'processed'>('pending');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const toggleProducts = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };
  function formatCurrency(amount: number, currencyCode = 'vi-VN', currency = 'VND') {
    const formatter = new Intl.NumberFormat(currencyCode, {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(amount);
  }

  function formatDateFromISO(isoDateString: string): string {
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const renderPendingOrder = (order: Order) => {
    const isPickup = order.address === "Tại quầy";

    return (
      <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden mb-4 hover:shadow-lg transition">
        <div className="p-6">
        <div className="flex justify-between items-start gap-3 mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{language() == "Tiếng Việt" ? `Đơn hàng ${order._id}` : `Bill: ${order._id}`}</h3>
            <p className="text-gray-500 text-sm">{formatDateFromISO(order.created_at)}</p>
          </div>
          <div className="bg-orange-100 text-orange-600 p-2 text-center rounded-full text-sm font-medium">
            {language() == "Tiếng Việt" ? "Chờ duyệt" : "Pending"}
          </div>
        </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">{language() == "Tiếng Việt" ? "Khách hàng" : "Customer"}</p>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 text-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <p className="font-medium truncate">{order.name}</p>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">{language() == "Tiếng Việt" ? "Số điện thoại" : "Phone Number"}</p>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 text-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <p className="font-medium truncate">{order.phone}</p>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">{language() == "Tiếng Việt" ? "Địa chỉ" : "Address"}</p>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 text-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <p className="font-medium truncate">{order.address}</p>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">{language() == "Tiếng Việt" ? "Tổng tiền" : "Total Amount"}</p>
              <p className="font-bold text-xl text-orange-600 truncate">{formatCurrency(order.total_bill)}</p>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">{language() == "Tiếng Việt" ? "Hình thức thanh toán" : "Payment Method"}</p>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2 text-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </div>
                <p className="font-medium truncate">{order.payment_type == 0 ? (language() == "Tiếng Việt" ? "Tiền mặt" : "Cash") : (language() == "Tiếng Việt" ? "Chuyển khoản" : "Bank Transfer")}</p>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
              <p className="text-gray-500 text-sm mb-1">{language() == "Tiếng Việt" ? "Trạng thái thanh toán" : "Payment Status"}</p>
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
                <p className={`font-medium ${order.payment_status == 1 ? 'text-green-600' : 'text-red-600'} truncate`}>
                  {order.payment_status == 1 ? (language() == "Tiếng Việt" ? 'Đã thanh toán' : 'Paid') : (language() == "Tiếng Việt" ? 'Chưa thanh toán' : 'Unpaid')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600 text-sm font-medium">{language() == "Tiếng Việt" ? 'Danh sách sản phẩm' : 'List product'}</p>
              <button
                onClick={() => toggleProducts(order._id)}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center"
              >
                {expandedOrders[order._id] ? (language() == "Tiếng Việt" ? 'Thu gọn' : 'Collapse') : (language() == "Tiếng Việt" ? 'Xem chi tiết' : 'View details')}
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
                  <span className="font-medium truncate">{product.title_translate_1} (x{product.quantity})</span>
                </div>
                <span className="text-orange-600 font-medium truncate">{formatCurrency(Number(product.price))}</span>
              </div>
            ))}
          </div>

          <div className={`flex ${screens.md ? 'gap-3' : 'gap-2'} mt-4 justify-end flex-wrap`}>
            {isPickup ? (
              <>
                {(order.delivery_type == 0 && order.payment_type == 0 && order.payment_status == 0) ? (
                  <button
                    onClick={() => handleConfirm(order._id)}
                    className={`${screens.md ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs'} bg-orange-500 cursor-pointer hover:bg-orange-600 text-white rounded-lg font-medium transition`}
                  >
                    {language() == "Tiếng Việt" ? "Xác nhận thanh toán" : "Confirm Payment"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleAproval(order._id)}
                    className={`${screens.md ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs'} bg-orange-500 cursor-pointer hover:bg-orange-600 text-white rounded-lg font-medium transition`}
                  >
                    {language() == "Tiếng Việt" ? "Duyệt" : "Approve"}
                  </button>
                )}
                <button
                  onClick={() => showModalReject(order._id)}
                  className={`${screens.md ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs'} bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                >
                  {language() == "Tiếng Việt" ? "Từ chối" : "Reject"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleAproval(order._id)}
                  className={`${screens.md ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs'} bg-orange-500 cursor-pointer hover:bg-orange-600 text-white rounded-lg font-medium transition`}
                >
                  {language() == "Tiếng Việt" ? "Duyệt" : "Approve"}
                </button>
                <button
                  onClick={() => showModalReject(order._id)}
                  className={`${screens.md ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs'} bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                >
                  {language() == "Tiếng Việt" ? "Từ chối" : "Reject"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProcessedOrder = (order: Order) => {
    const isPickup = order.address === order.receiving_address || order.order_status == 1;
    const statusColors: Record<string, string> = {
      "Thành công": "bg-green-100 text-green-600",
      "Duyệt thành công": "bg-green-100 text-green-600",
      "Đang giao": "bg-blue-100 text-blue-600",
      "Thất bại": "bg-red-100 text-red-600"
    };

    return (
      <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
        <div className="p-6">
        <div className="flex justify-between items-start gap-3 mb-4">
          <div>
          <h3 className="text-xl font-semibold text-gray-800">{language() == "Tiếng Việt" ? `Đơn hàng ${order._id}` : `Bill: ${order._id}`}</h3>
            <p className="text-gray-500 text-sm">{formatDateFromISO(order.created_at)}</p>
          </div>
          <div className={`${statusColors[order.order_status == 1 ? "Duyệt thành công" : order.order_status == 2 ? "Đang giao" : order.order_status == 4 ? "Thành công" : "Thất bại"]} p-2 text-center rounded-full text-xs font-medium`}>
            {order.order_status == 1
              ? language() == "Tiếng Việt" ? "Duyệt thành công" : "Approved"
              : order.order_status == 2
                ? language() == "Tiếng Việt" ? "Đang giao" : "Shipping"
                : order.order_status == 4
                  ? language() == "Tiếng Việt" ? "Thành công" : "Success"
                  : language() == "Tiếng Việt" ? "Thất bại" : "Failed"}
          </div>
        </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
            <p className="text-gray-500 text-sm mb-1">{language() == "Tiếng Việt" ? "Khách hàng" : "Customer"}</p>
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2 text-orange-500">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <p className="font-medium truncate">{order.name}</p>
            </div>
          </div>
          <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
            <p className="text-gray-500 text-sm mb-1">{language() == "Tiếng Việt" ? "Số điện thoại" : "Phone Number"}</p>
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2 text-orange-500">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <p className="font-medium truncate">{order.phone}</p>
            </div>
          </div>
          <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
            <p className="text-gray-500 text-sm mb-1">{language() == "Tiếng Việt" ? "Địa chỉ" : "Address"}</p>
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2 text-orange-500">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <p className="font-medium truncate">{order.address}</p>
            </div>
          </div>
          <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
            <p className="text-gray-500 text-sm mb-1">{language() == "Tiếng Việt" ? "Tổng tiền" : "Total Amount"}</p>
            <p className="font-bold text-xl text-orange-600 truncate">{formatCurrency(order.total_bill)}</p>
          </div>
          <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
            <p className="text-gray-500 text-sm mb-1">{language() == "Tiếng Việt" ? "Hình thức thanh toán" : "Payment Method"}</p>
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2 text-orange-500">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>
              <p className="font-medium truncate">{order.payment_type == 0 ? (language() == "Tiếng Việt" ? "Tiền mặt" : "Cash") : (language() == "Tiếng Việt" ? "Chuyển khoản" : "Bank Transfer")}</p>
            </div>
          </div>
          <div className="border-b border-gray-200 pb-3 hover:bg-orange-50 transition rounded p-2">
            <p className="text-gray-500 text-sm mb-1">{language() == "Tiếng Việt" ? "Trạng thái thanh toán" : "Payment Status"}</p>
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
              <p className={`font-medium ${order.payment_status == 1 ? 'text-green-600' : 'text-red-600'} truncate`}>
                {order.payment_status == 1 ? (language() == "Tiếng Việt" ? 'Đã thanh toán' : 'Paid') : (language() == "Tiếng Việt" ? 'Chưa thanh toán' : 'Unpaid')}
              </p>
            </div>
          </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600 text-sm font-medium">{language() == "Tiếng Việt" ? 'Danh sách sản phẩm' : 'List product'}</p>
              <button
                onClick={() => toggleProducts(order._id)}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center"
              >
                {expandedOrders[order._id] ? (language() == "Tiếng Việt" ? 'Thu gọn' : 'Collapse') : (language() == "Tiếng Việt" ? 'Xem chi tiết' : 'View details')}
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
                  <span className="font-medium truncate">{product.title_translate_1} (x{product.quantity})</span>
                </div>
                <span className="text-orange-600 font-medium truncate">{formatCurrency(Number(product.price))}</span>
              </div>
            ))}
          </div>
          <div className="flex cursor-pointer gap-3 mt-6 justify-end">
            {(isPickup && order.order_status !== 5 && order.payment_type == 0) &&
              <button
                onClick={() => handleConfirmSuccess(order._id)}
                className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {language() == "Tiếng Việt" ? "Xác nhận đơn hàng thành công" : "Confirm Order Success"}
              </button>
            }

            {order.order_status == 5 ? <p className='text-red-500 font-bold'>{language() == "Tiếng Việt" ? "Đơn hàng đã bị từ chối hoặc bị huỷ" : "Order has been rejected or cancelled"}</p> :
            order.order_status == 4 ? <div className='flex gap-4 items-center'>
              <p className='text-green-500 font-bold'>{language() == "Tiếng Việt" ? "Hoàn thành đơn hàng" : "Order completed"}</p>
              <button
              onClick={() => OpenBillPDF(order.bill_url)}
                className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >Xuất bill</button>
            </div> :
              <button
                onClick={() => showModalCancel(order._id)}
                className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {language() == "Tiếng Việt" ? "Huỷ đơn hàng" : "Cancel Order"}
              </button>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-gray-100 min-h-screen ${screens.lg ? 'p-8' : 'p-4'}`}>
      {contextHolder}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className={`flex ${screens.md ? 'space-x-4' : 'space-x-2'} border-b border-gray-200`}>
            <button
              className={`pb-3 px-4 text-sm font-medium ${activeTab === 'pending' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('pending')}
            >
              {language() == "Tiếng Việt" ? `Đơn đang chờ duyệt (${waitData.length})` : `Pending Orders (${waitData.length})`}
            </button>
            <button
              className={`pb-3 px-4 text-sm font-medium ${activeTab === 'processed' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('processed')}
            >
              {language() == "Tiếng Việt" ? `Đơn đã xử lý (${doneData.length})` : `Processed Orders (${doneData.length})`}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {activeTab === 'pending' ? (
            waitData.length > 0 ? (
              waitData.slice().reverse().map(renderPendingOrder)
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="mt-2 text-gray-500">{language() == "Tiếng Việt" ? "Không có đơn hàng nào đang chờ duyệt" : "No pending orders"}</p>
              </div>
            )
          ) : (
              doneData.length > 0 ? (
              doneData.slice().reverse().map(renderProcessedOrder)
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p className="mt-2 text-gray-500">{language() == "Tiếng Việt" ? "Không có đơn hàng nào đã xử lý" : "No processed orders"}</p>
              </div>
            )
          )}
        </div>
      </div>
      <Modal width={screens.lg ? '50%' : '90%'} title={language() == "Tiếng Việt" ? "Lý do từ chối đơn hàng" : "Reasons for order rejection"} onOk={() => handleReject(selectID ? selectID : "")} okText={language() == "Tiếng Việt" ? "Xác nhận" : "Confirm"} open={showreasonmodal} onCancel={() => setShowreasonmodal(false)} onClose={() => setShowreasonmodal(false)}>
        <div className="flex gap-2 flex-col">
            <p>{language() == "Tiếng Việt" ? "Lý do:" : "Reason:"}</p>
            <Input placeholder="Vui lòng nhập lý do cụ thể"
                    value={reasonRejection}
                    onChange={(e) => setReason(e.target.value)}/>
        </div>
      </Modal>

      <Modal width={screens.lg ? '50%' : '90%'} title={language() == "Tiếng Việt" ? "Lý do huỷ đơn hàng" : "Reasons for order cancelation"} onOk={() => handleCancel(selectID ? selectID : "")} okText={language() == "Tiếng Việt" ? "Xác nhận" : "Confirm"} open={showCancelmodal} onCancel={() => setShowcancelmodal(false)} onClose={() => setShowcancelmodal(false)}>
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