import React, { useState, useEffect, useRef } from 'react';
import Verify from '../components/VerifyToken.components';
import { message } from 'antd';
import { RESPONSE_CODE } from '../../constants/responseCode.constants';
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL)

interface Order {
  _id: string;
  canceled_at: string;
  canceled_by: string | null;
  cancellation_reason: string;
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
  expanded: boolean,
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

interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShipManagement: React.FC<Props> = (props) => {
  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }
  const allReceivedOrders = useRef<Order[]>([]);
  const allWaitingOrders = useRef<Order[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [activeTab, setActiveTab] = useState<'waiting' | 'received'>('waiting');
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token")); 
  const [waitingOrders, setWaitingOrders] = useState<Order[]>([]);
  const [receivedOrders, setReceivedOrders] = useState<Order[]>([]);

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
    socket.emit('connect-shipper-realtime', refresh_token)
    socket.on('create-delivery', (data) => {
      messageApi.info(language() === "Tiếng Việt" ? "Có đơn giao hàng mới" : "New delivery order available");
        setWaitingOrders((prev) => [
          ...prev, { ...data, expanded: false }
        ]);
        setReceivedOrders((prev) => prev.filter((item) => item._id !== data._id))
    })

    // socket chưa đúng
    socket.on('remove-delivery', (data) => {
      setWaitingOrders((prev) => prev.filter((item) => item._id !== data._id))
      setReceivedOrders((prev) => [...prev, { ...data, expanded: false }])
      messageApi.info(language() === "Tiếng Việt" ? "Đơn hàng đã được nhận giao" : "Order has been received for delivery");
    })

    socket.on('cancel-delivery', (data) => {
      setWaitingOrders((prev) => prev.filter((item) => item._id !== data._id))
      setReceivedOrders((prev) => prev.filter((item) => item._id !== data._id))
      messageApi.info(language() === "Tiếng Việt" ? "Đơn hàng đã bị hủy" : "Order has been canceled");
    })

    return () => {
      socket.off('create-delivery');
      socket.off('remove-delivery');
      socket.off('cancel-delivery');
    }
  })

  const changeFillter = (fill: string) => {
    setActiveFilter(fill)
    fillShipBill(fill)
  }

  const fillShipBill = (type: string) => {
    if (type === "Tất cả") {
      setWaitingOrders(allWaitingOrders.current);
      setReceivedOrders(allReceivedOrders.current);
    } else if (type === "Phí ship cao nhất") {
      if(allWaitingOrders.current.length > 0) {
        const maxFee = Math.max(...allWaitingOrders.current.map(order => order.fee));
        setWaitingOrders(allWaitingOrders.current.filter((order) => order.fee === maxFee));
      }
      if (allReceivedOrders.current.length > 0) {
        const maxFee = Math.max(...allReceivedOrders.current.map(order => order.fee));
        setReceivedOrders(allReceivedOrders.current.filter((order) => order.fee === maxFee));
      }
    } else if (type === "Phí ship thấp nhất") {
      if(allWaitingOrders.current.length > 0) {
        const minFee = Math.min(...allWaitingOrders.current.map(order => order.fee));
        setWaitingOrders(allWaitingOrders.current.filter((order) => order.fee === minFee));
      }
      if (allReceivedOrders.current.length > 0) {
        const minFee = Math.min(...allReceivedOrders.current.map(order => order.fee));
        setReceivedOrders(allReceivedOrders.current.filter((order) => order.fee === minFee));
      }
    }
  };

  const TakeBill = (orderID: string) => {
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

          fetch(`${import.meta.env.VITE_API_URL}/api/orders/receive-delivery`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
          }).then((response) => {
            return response.json()
          }).then((data) => {
            if(data.code == RESPONSE_CODE.RECEIVE_DELIVERY_FAILED) {
              messageApi.error(data.message)
              return
            }
            if(data.code == RESPONSE_CODE.RECEIVE_DELIVERY_SUCCESSFUL) {
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

  const ConfirmBill = (orderID: string) => {
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

          fetch(`${import.meta.env.VITE_API_URL}/api/orders/confirm-delivery-completion`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
          }).then((response) => {
            return response.json()
          }).then((data) => {
            if(data.code == RESPONSE_CODE.CONFIRM_DELIVERY_COMPLETION_FAILED) { 
              messageApi.error(data.message)
              return
            }
            if(data.code == RESPONSE_CODE.CONFIRM_DELIVERY_COMPLETION_SUCCESSFUL) {
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

  const RejectBill = (orderID: string) => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
      if (isValid) {
          props.setLoading(true)
          try {
            const body = {
              language: null,
              refresh_token: refresh_token,
              order_id: orderID
            }
  
            fetch(`${import.meta.env.VITE_API_URL}/api/orders/cancel-order-shipper`, {
              method: 'PUT',
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body)
            }).then((response) => {
              return response.json()
            }).then((data) => {
              if(data.code == RESPONSE_CODE.CANCEL_ORDER_FAILED) { 
                messageApi.error(data.message)
                return
              }
              if(data.code == RESPONSE_CODE.CANCEL_ORDER_SUCCESSFUL) {
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

  const takeLocation = (longitude: number | null, latitude: number | null) => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
      if (isValid) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const originLatitude = position.coords.latitude;
              const originLongitude = position.coords.longitude;
      
              const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLatitude},${originLongitude}&destination=${longitude},${latitude}`;
              window.open(googleMapsUrl, '_blank');
            },
            (error) => {
              messageApi.error(language() === "Tiếng Việt" ? "Không thể lấy vị trí hiện tại" : "Unable to get current location");
              console.error("Lỗi lấy vị trí:", error);
            }
          );
        } else {
          messageApi.error(language() === "Tiếng Việt" ? "Trình duyệt không hỗ trợ Geolocation" : "Geolocation not supported by browser");
        }
      } else {
        messageApi.error(
          language() === 'Tiếng Việt' ? 'Người dùng không hợp lệ' : 'Invalid User'
        );
      }
    };
    checkToken();
  };
  useEffect(() => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
      if (isValid) {
        const body = {
          language: null,
          refresh_token: refresh_token
        };

        const fetchNewOrders = fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-shipper`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(body)
        }).then(response => response.json());

        const fetchOldOrders = fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-shipper`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(body)
        }).then(response => response.json());

        Promise.all([fetchNewOrders, fetchOldOrders])
          .then(([newOrdersData, oldOrdersData]) => {
            if (newOrdersData.code === RESPONSE_CODE.GET_ORDER_SUCCESSFUL) {
              const waitingOrder = newOrdersData.order.map((order: Order) => ({ ...order, expanded: false }))
              setWaitingOrders(waitingOrder);
              allWaitingOrders.current = waitingOrder
            }
            if (oldOrdersData.code === RESPONSE_CODE.GET_ORDER_SUCCESSFUL) {
              const received = oldOrdersData.order.map((order: Order) => ({ ...order, expanded: false }));
              setReceivedOrders(received);
              allReceivedOrders.current = received; // Lưu bản gốc vào ref
            }
          });
      } else {
        messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        return
      }
    };
        
    checkToken();
  }, [refresh_token, access_token, messageApi])
  
  // Sample data with more items

  useEffect(() => {
    console.log(waitingOrders)
    console.log(receivedOrders)
  }, [waitingOrders, receivedOrders])

  // Toggle order expansion
  const toggleOrderExpansion = (orderId: string): void => {
    if (activeTab === 'waiting') {
      setWaitingOrders(waitingOrders.map(order => 
        order._id === orderId 
          ? {...order, expanded: !order.expanded} 
          : order
      ));
    } else {
      setReceivedOrders(receivedOrders.map(order => 
        order._id === orderId 
          ? {...order, expanded: !order.expanded} 
          : order
      ));
    }
  };

  // // Calculate total for an order
  // const calculateTotal = (order: Order): number => {
  //   return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + order.deliveryFee;
  // };

  // Get orders based on active tab


  const filterOptions: string[] = ["Tất cả", "Phí ship cao nhất", "Phí ship thấp nhất"];
  const [activeFilter, setActiveFilter] = useState<string>("Tất cả");

  const getActiveOrders = (): Order[] => {
    return activeTab === 'waiting' ? waitingOrders : receivedOrders;
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

  return (
    <div className="bg-gray-50 p-4 w-full mx-auto">
  {/* Tabs */}
      {contextHolder}
      <div className="mb-4 overflow-x-auto">
        <div className="flex whitespace-nowrap">
          <button
            onClick={() => setActiveTab('waiting')}
            className={`px-4 py-2 font-medium cursor-pointer ${
              activeTab === 'waiting' ? 'bg-orange-500 text-white' : 'bg-gray-200'
            } rounded-tl rounded-bl sm:px-6 md:px-8`}
          >
            Chờ giao ({waitingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 font-medium cursor-pointer ${
              activeTab === 'received' ? 'bg-orange-500 text-white' : 'bg-gray-200'
            } rounded-tr rounded-br sm:px-6 md:px-8`}
          >
            Đã nhận ({receivedOrders.length})
          </button>
        </div>
      </div>

      {/* Orders container */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium mb-3 sm:text-xl md:text-2xl sm:mb-4">
          {activeTab === 'waiting' ? 'Đơn hàng đang chờ nhận giao:' : 'Đơn hàng đã giao:'}
        </h2>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <div className="flex-shrink-0 flex gap-2">
            {filterOptions.map(filter => (
              <button
                key={filter}
                onClick={() => changeFillter(filter)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                } sm:px-6 md:px-8`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {getActiveOrders().map(order => (
            <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Order header - entire header clickable for toggle */}
              <div
                className="flex gap-3 items-center justify-between overflow-x-auto bg-gray-50 w-full px-4 py-3 cursor-pointer hover:bg-gray-100 transition sm:px-6 md:px-8"
                onClick={() => toggleOrderExpansion(order._id)}
              >
                <div className="flex items-center gap-3 sm:gap-5">
                  <span className="inline-flex items-center justify-center bg-gray-200 h-8 w-8 rounded mr-2 sm:h-10 sm:w-10 sm:mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </span>
                  <span className="font-medium sm:text-base">Đơn: {order._id}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2 sm:mr-4 sm:text-sm">{formatDateFromISO(order.created_at)}</span>
                  {activeTab === 'received' && order.order_status !== 4 && (
                    <button
                      type="button"
                      className="h-8 w-8 flex items-center justify-center cursor-pointer text-red-500 hover:bg-red-50 rounded-full mr-2 transition sm:h-10 sm:w-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        RejectBill(order._id);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <span className="h-8 w-8 flex items-center justify-center sm:h-10 sm:w-10">
                    {order.expanded ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </span>
                </div>
              </div>

              {order.expanded && (
                <div className="p-4 sm:p-6">
                  {/* Order items */}
                  <div className="space-y-2 mb-4 sm:space-y-3 sm:mb-6">
                    {order.product.map(item => (
                      <div key={item._id} className="flex justify-between items-center border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition sm:p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center mr-3 text-orange-600 sm:w-10 sm:h-10">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium sm:text-base">{item.title_translate_1}</p>
                            <p className="text-sm text-gray-600 sm:text-xs">{formatCurrency(Number(item.price))}</p>
                          </div>
                        </div>
                        {/* Removed the delete button for products */}
                      </div>
                    ))}
                  </div>

                  {/* Order status */}
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <div className="flex-1">
                      <p className="font-medium sm:text-base">
                        Trạng thái đơn hàng:
                        <span className={`ml-2 ${
                          order.order_status === 0 ? "text-yellow-500" :
                          order.order_status === 1 ? "text-blue-500" :
                          order.order_status === 2 ? "text-blue-600" :
                          order.order_status === 3 ? "text-green-600" :
                          order.order_status === 4 ? "text-green-500" :
                          "text-red-500"
                        }`}>
                          {order.order_status === 0 ? "Đang chờ duyệt" :
                          order.order_status === 1 ? "Đang chờ nhận giao hàng" :
                          order.order_status === 2 ? "Đang giao" :
                          order.order_status === 3 ? "Giao đơn thành công" :
                          order.order_status === 4 ? "Thành công" : "Thất bại"}
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => takeLocation(order.delivery_longitude, order.delivery_latitude)}
                      className="px-4 py-1.5 cursor-pointer bg-white border border-gray-200 rounded-md hover:bg-gray-50 font-medium text-sm transition sm:px-6 sm:py-2"
                    >
                      MAP
                    </button>
                  </div>

                  {/* Delivery info */}
                  <div className="mb-4 space-y-1 text-sm sm:space-y-2 sm:text-base">
                    <p><span className="text-gray-600">Địa chỉ nhận hàng:</span> {order.delivery_address}</p>
                    <p><span className="text-gray-600">Địa chỉ giao hàng:</span> {order.receiving_address}</p>
                    <p><span className="text-gray-600">Khoảng cách:</span> {order.distance} km</p>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 sm:pt-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 sm:text-base">Phí giao hàng: {formatCurrency(order.fee - (order.fee * 15/100))}</p>
                      <p className="text-xl font-bold text-orange-500 sm:text-2xl">{formatCurrency(order.total_bill)}</p>
                    </div>
                    {activeTab === 'waiting' ? (
                      <button
                        type="button"
                        className="rounded-md p-2 gap-2 cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition sm:px-4 sm:py-2"
                        onClick={() => TakeBill(order._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="sm:text-sm">Nhận đơn hàng</span>
                      </button>
                    ) : (order.order_status == 4 ?
                      <div className="cursor-pointer p-2 gap-2 bg-white border border-gray-200 transition hover:bg-gray-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 sm:h-7 sm:w-7" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div> :
                      <div className="cursor-pointer p-2 gap-2 bg-white border border-gray-200 transition hover:bg-gray-50 flex items-center justify-center" onClick={() => ConfirmBill(order._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 sm:h-7 sm:w-7" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="sm:text-sm">Giao đơn hàng thành công</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShipManagement;