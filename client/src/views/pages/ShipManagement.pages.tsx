import React, { useState, useEffect } from 'react';
import Verify from '../components/VerifyToken.components';
import { message } from 'antd';
import { RESPONSE_CODE } from '../../constants/responseCode.constants';
// Define types for our data

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

  const TakeBill = (orderID: string) => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
      if (isValid) {
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
            console.log(data)
            if(data.code == RESPONSE_CODE.RECEIVE_DELIVERY_SUCCESSFUL) {
              messageApi.success(data.message)
              const body = {
                language: null,
                refresh_token: refresh_token
              } 
          
              fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-shipper`, {
                  method: 'POST',
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${access_token}`,
                  },
                  body: JSON.stringify(body)
              }).then(response => {
                  return response.json()
              }).then((data) => {
                  console.log(data)
                  if(data.code == "GET_ORDER_SUCCESSFUL") {
                    setWaitingOrders(data.order.map((order: Order) => ({ ...order, expanded: false })));
                  }
              })
          
              fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-shipper`, {
                  method: 'POST',
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${access_token}`,
                  },
                  body: JSON.stringify(body)
              }).then(response => {
                  return response.json()
              }).then((data) => {
                  console.log(data)
                  if(data.code == "GET_ORDER_SUCCESSFUL") {
                    setReceivedOrders(data.order.map((order: Order) => ({ ...order, expanded: false })));
                  }
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

  const ConfirmBill = (orderID: string) => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
      if (isValid) {
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
            console.log(data)
            if(data.code == RESPONSE_CODE.CONFIRM_DELIVERY_COMPLETION_SUCCESSFUL) {
              messageApi.success(data.message)
              const body = {
                language: null,
                refresh_token: refresh_token
              } 
          
              fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-shipper`, {
                  method: 'POST',
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${access_token}`,
                  },
                  body: JSON.stringify(body)
              }).then(response => {
                  return response.json()
              }).then((data) => {
                  console.log(data)
                  if(data.code == "GET_ORDER_SUCCESSFUL") {
                    setWaitingOrders(data.order.map((order: Order) => ({ ...order, expanded: false })));
                  }
              })
          
              fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-shipper`, {
                  method: 'POST',
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${access_token}`,
                  },
                  body: JSON.stringify(body)
              }).then(response => {
                  return response.json()
              }).then((data) => {
                  console.log(data)
                  if(data.code == "GET_ORDER_SUCCESSFUL") {
                    setReceivedOrders(data.order.map((order: Order) => ({ ...order, expanded: false })));
                  }
              })
            } else {
              messageApi.error(data.message)
              return
            }
          })    
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
            console.log(data)
            if(data.code == RESPONSE_CODE.CANCEL_ORDER_SUCCESSFUL) {
              messageApi.success(data.message)
              const body = {
                language: null,
                refresh_token: refresh_token
              } 
          
              fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-shipper`, {
                  method: 'POST',
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${access_token}`,
                  },
                  body: JSON.stringify(body)
              }).then(response => {
                  return response.json()
              }).then((data) => {
                  console.log(data)
                  if(data.code == "GET_ORDER_SUCCESSFUL") {
                    setWaitingOrders(data.order.map((order: Order) => ({ ...order, expanded: false })));
                  }
              })
          
              fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-shipper`, {
                  method: 'POST',
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${access_token}`,
                  },
                  body: JSON.stringify(body)
              }).then(response => {
                  return response.json()
              }).then((data) => {
                  console.log(data)
                  if(data.code == "GET_ORDER_SUCCESSFUL") {
                    setReceivedOrders(data.order.map((order: Order) => ({ ...order, expanded: false })));
                  }
              })
            } else {
              messageApi.error(data.message)
              return
            }
          })    
      } else {
          messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
      }
  };
    checkToken();
  } 

  const takeLocation = (longtitude: number|null, lattitude: number|null) => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
      if (isValid) {
        if(longtitude !== null && lattitude !== null) {
          messageApi.info(`${longtitude} | ${lattitude}`)
        }
        else {
          messageApi.error(language() == "Tiếng Việt" ? "Lỗi khi lấy vị trí" : "Error getting location")
          return
        };
      } else {
        messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
      }
    };
    checkToken();
  }
  useEffect(() => {
    const body = {
      language: null,
      refresh_token: refresh_token
    } 

    fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-new-order-shipper`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(body)
    }).then(response => {
        return response.json()
    }).then((data) => {
        console.log(data)
        if(data.code == "GET_ORDER_SUCCESSFUL") {
          setWaitingOrders(data.order.map((order: Order) => ({ ...order, expanded: false })));
        }
    })

    fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-old-order-shipper`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(body)
    }).then(response => {
        return response.json()
    }).then((data) => {
        console.log(data)
        if(data.code == "GET_ORDER_SUCCESSFUL") {
          setReceivedOrders(data.order.map((order: Order) => ({ ...order, expanded: false })));
        }
    })
  }, [refresh_token, access_token])
  
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
  const getActiveOrders = (): Order[] => {
    return activeTab === 'waiting' ? waitingOrders : receivedOrders;
  };


  const filterOptions: string[] = ["Tất cả", "đơn mới nhất", "đơn cũ nhất"];
  const [activeFilter, setActiveFilter] = useState<string>("Tất cả");

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
      <div className="flex mb-4">
        <button 
          onClick={() => setActiveTab('waiting')}
          className={`px-4 cursor-pointer py-2 font-medium ${
            activeTab === 'waiting' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200'
          } rounded-tl rounded-bl`}
        >
          Chờ giao ({waitingOrders.length})
        </button>
        <button 
          onClick={() => setActiveTab('received')}
          className={`px-4 cursor-pointer py-2 font-medium ${
            activeTab === 'received' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200'
          } rounded-tr rounded-br`}
        >
          Đã nhận ({receivedOrders.length})
        </button>
      </div>

      {/* Orders container */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium mb-3">
          {activeTab === 'waiting' ? 'Đơn hàng đã nhận:' : 'Đơn hàng đã giao:'}
        </h2>
        
        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {filterOptions.map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                activeFilter === filter 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {getActiveOrders().map(order => (
            <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Order header - entire header clickable for toggle */}
              <div 
                className="flex items-center justify-between bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => toggleOrderExpansion(order._id)}
              >
                <div className="flex items-center gap-5">
                  <span className="inline-flex items-center justify-center bg-gray-200 h-8 w-8 rounded mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </span>
                  <span className="font-medium">Đơn: {order.product.map((name: Product, index: number) => {
                    if(index < order.product.length) {
                      return `${language() == "Tiếng Việt" ? name.title_translate_1 : name.description_translate_2}, `
                    }
                    if(index == order.product.length)
                    return `${language() == "Tiếng Việt" ? name.title_translate_1 : name.description_translate_2}`
                  })}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-4">{formatDateFromISO(order.created_at)}</span>
                  {/* Only show delete button in received tab */}
                  {activeTab === 'received' && order.order_status !== 4 && (
                    <button 
                      type="button" 
                      className="h-8 w-8 flex items-center justify-center cursor-pointer text-red-500 hover:bg-red-50 rounded-full mr-2 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        RejectBill(order._id) // Prevent triggering the parent onClick
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <span className="h-8 w-8 flex items-center justify-center">
                    {order.expanded ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </span>
                </div>
              </div>

              {/* Order details - collapsible */}
              {order.expanded && (
                <div className="p-4">
                  {/* Order items */}
                  <div className="space-y-2 mb-4">
                    {order.product.map(item => (
                      <div key={item._id} className="flex justify-between items-center border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition">
                        <div className="flex items-center">
                          <div className="bg-gray-100 rounded-md p-1 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">{item.title_translate_1}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(Number(item.price))}</p>
                          </div>
                        </div>
                        {/* Removed the delete button for products */}
                      </div>
                    ))}
                  </div>

                  {/* Order status */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex-1">
                      <p className="font-medium">
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
                          order.order_status === 1 ? "Duyệt thành công" : 
                          order.order_status === 2 ? "Đang giao" : 
                          order.order_status === 3 ? "Giao đơn thành công" : 
                          order.order_status === 4 ? "Thành công" : "Thất bại"}
                        </span>
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => takeLocation(order.delivery_longitude, order.delivery_latitude)}
                      className="px-4 py-1.5 cursor-pointer bg-white border border-gray-200 rounded-md hover:bg-gray-50 font-medium text-sm transition"
                    >
                      MAP
                    </button>
                  </div>

                  {/* Delivery info */}
                  <div className="mb-4 space-y-1 text-sm">
                    <p><span className="text-gray-600">Địa chỉ giao hàng:</span> {order.receiving_address}</p>
                    <p><span className="text-gray-600">Khoảng cách:</span> {order.distance}</p>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Phí giao hàng: {order.fee.toLocaleString()}vnđ</p>
                      <p className="text-xl font-bold text-orange-500">{formatCurrency(order.total_bill)}</p>
                    </div>
                    {activeTab === 'waiting' ? (
                      <button 
                        type="button"
                        className="rounded-md p-2 gap-2 cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition"
                        onClick={() => TakeBill(order._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Nhận đơn hàng
                      </button>
                    ) : (order.order_status == 4 ?
                      <div className="cursor-pointer p-2 gap-2 bg-white border border-gray-200 transition hover:bg-gray-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div> : <div className="cursor-pointer p-2 gap-2 bg-white border border-gray-200 transition hover:bg-gray-50 flex items-center justify-center" onClick={() => ConfirmBill(order._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Giao đơn hàng thành công
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