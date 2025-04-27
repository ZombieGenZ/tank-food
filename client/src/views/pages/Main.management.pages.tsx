// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Verify from '../components/VerifyToken.components';
import { Button, message, Select, ConfigProvider, } from "antd";
import io from "socket.io-client";
import { createStyles } from 'antd-style';
// import { RESPONSE_CODE } from "../../constants/responseCode.constants";

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #fbbf24, #f97316);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const socket = io(import.meta.env.VITE_API_URL)

interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

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

interface DailyData {
  date: string; // Ngày dạng "dd/MM/yyyy"
  newCustomers: number;
  ordersCount: number;
  productsCount: number;
  revenue: number;
}

interface StatisticalData {
  comparison: {
    totalNewCustomersChange: number;
    totalOrdersChange: number;
    totalProductsChange: number;
    totalRevenueChange: number;
  };
  dailyBreakdown: DailyData[];
  totalNewCustomers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

function MainManage(props: Props): JSX.Element{
    const { styles } = useStyle();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [list, setList] = useState<StatisticalData|null>(null)
    const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
    const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
    const [selectValue, setSelectValue] = useState<string>("revenue")
    const [selectDate, setSelectDate] = useState<number>(7)

    const handletoOrder = () => {
      try {
        props.setLoading(true)
        navigate('/order')
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
    }

    const handleChange = (value: string) => {
      setSelectValue(value)
    }

    const handleChangeDate = (value: number) => {
      setSelectDate(value)
    }

    const language = (): string => {
      const language = localStorage.getItem('language')
      return language ? JSON.parse(language) : "Tiếng Việt"
    }

    const [recentOrders, setRecentOrder] = useState<Order[]>([])

    useEffect(() => {
      socket.emit('connect-statistical-realtime', refresh_token)
      socket.on('update-order-complete', (res) => {
        messageApi.info("Đơn hàng đã được cập nhật")
        setRecentOrder((prevOrders) => [...prevOrders, res])
        update()
      })

      socket.on('update-chart', (res) => {
        messageApi.info("Bảng thống kê có sự thay đổi")
        console.log(res)
        update()
      })
      return () => {
        socket.off('update-order-complete')
        socket.off('update-chart')
      }
    })

    // const recentOrders = [
    //   { id: '12345', date: '21/03/2025', amount: '2.350.000₫', status: 'completed' },
    //   { id: '12344', date: '20/03/2025', amount: '1.750.000₫', status: 'processing' },
    //   { id: '12343', date: '19/03/2025', amount: '3.120.000₫', status: 'pending' }
    // ];

    const update = () => {
      const body = {
        language: null,
        refresh_token: refresh_token,
        time: selectDate,
      }
      fetch(`${import.meta.env.VITE_API_URL}/api/statistical/overview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(body),
      }).then(response => {
        return response.json()
      }).then((data) => {
        setList(data.statistical)
      })

      const body1 = {
        language: null, 
        refresh_token: refresh_token
      }

      fetch(`${import.meta.env.VITE_API_URL}/api/orders/get-order-overview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(body1),
      }).then(response => {
        return response.json()
      }).then(data => {
        setRecentOrder(data.order)
      })
    }

    useEffect(() => {
      const checkToken = async () => {
        const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          update()
        } else {
          messageApi.error("Token không hợp lệ!");
        }
      };
    checkToken();
    }, [refresh_token, access_token, messageApi, selectDate]);

    const DownloadFile = async () => {
      const checkToken = async () => {
        const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          try {
            props.setLoading(true)
            const body = {
              language: null,
              refresh_token: refresh_token,
              time: selectDate
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/statistical/export`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to export statistics');
            }
            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = 'statistics.xlsx';
      
            if (contentDisposition) {
              const fileNameMatch = contentDisposition.match(/filename=(?:"([^"]+)"|(\S+))/);
              if (fileNameMatch) {
                fileName = fileNameMatch[1] || fileNameMatch[2];
              }
            }

            messageApi.success("Xuất thống kê thành công!")
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

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
            }, 2500)
          }
        } else {
          messageApi.error("Token không hợp lệ!");
        }
      };
      checkToken();
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

    return(
      <div className="flex-1 overflow-auto">
      {contextHolder}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-sm p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bottom-0 left-0 opacity-5" style={{ backgroundColor: "#f97316" }}></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `#f9731620` }}>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#f97316" }}></div>
                </div>
                <span className="text-gray-500 font-bold text-sm">{language() == "Tiếng Việt" ? "Tổng đơn hàng" : "Total bill"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-slate-900 mr-1">{list?.totalOrders}</span>
                  <span className="text-gray-500 text-xs">{language() == "Tiếng Việt" ? "đơn" : "bill"}</span>
                </div>
                <div className={`mt-1 text-xs ${list?.comparison.totalOrdersChange ? 'text-green-600' : 'text-red-600'}`}>
                  {list?.comparison.totalOrdersChange} {list?.comparison.totalOrdersChange  ? '↑' : '↓'}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bottom-0 left-0 opacity-5" style={{ backgroundColor: "#3b82f6" }}></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `#3b82f620` }}>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#3b82f6" }}></div>
                </div>
                <span className="text-gray-500 font-bold text-sm">{language() == "Tiếng Việt" ? "Số khách hàng mới" : "Total bill"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-slate-900 mr-1">{list?.totalNewCustomers}</span>
                  <span className="text-gray-500 text-xs">{language() == "Tiếng Việt" ? "khách hàng mới" : "new customers"}</span>
                </div>
                <div className={`mt-1 text-xs ${list?.comparison.totalNewCustomersChange ? 'text-green-600' : 'text-red-600'}`}>
                  {list?.comparison.totalNewCustomersChange} {list?.comparison.totalNewCustomersChange ? '↑' : '↓'}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bottom-0 left-0 opacity-5" style={{ backgroundColor: "#22c55e" }}></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `#22c55e20` }}>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#22c55e" }}></div>
                </div>
                <span className="text-gray-500 font-bold text-sm">{language() == "Tiếng Việt" ? "Số sản phẩm đã bán" : "Number of products sold"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-slate-900 mr-1">{list?.totalProducts}</span>
                  <span className="text-gray-500 text-xs">{language() == "Tiếng Việt" ? "sản phẩm" : "products"}</span>
                </div>
                <div className={`mt-1 text-xs ${list?.comparison.totalProductsChange ? 'text-green-600' : 'text-red-600'}`}>
                  {list?.comparison.totalProductsChange} {list?.comparison.totalProductsChange ? '↑' : '↓'}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bottom-0 left-0 opacity-5" style={{ backgroundColor: "#a855f7" }}></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `#a855f720` }}>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#a855f7" }}></div>
                </div>
                <span className="text-gray-500 font-bold text-sm">{language() == "Tiếng Việt" ? "Doanh thu" : "Revenue"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-slate-900 mr-1">{formatCurrency(list?.totalRevenue ?? 0)}</span>
                </div>
                <div className={`mt-1 text-xs ${list?.comparison.totalRevenueChange ? 'text-green-600' : 'text-red-600'}`}>
                  {list?.comparison.totalRevenueChange} {list?.comparison.totalRevenueChange ? '↑' : '↓'}
                </div>
              </div>
            </div>
          </div>
        </div>
      
      {/* Charts and Orders Section */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 p-4 md:p-6">
        {/* Revenue Chart */}
          <div className="bg-white rounded-lg w-full lg:w-2/3 shadow-sm p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{language() == "Tiếng Việt" ? "Biểu đồ doanh thu" : "Revenue chart"}</h2>
                <p className="text-sm text-gray-500">
                  {selectDate} {language() == "Tiếng Việt" ? "ngày gần đây" : "recent days"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
                <Select 
                  value={selectDate}
                  onChange={handleChangeDate}
                  className="w-full sm:w-32"
                  options={[
                    { value: 7, label: language() == "Tiếng Việt" ? '7 ngày' : '7 days' },
                    { value: 14, label: language() == "Tiếng Việt" ? '14 ngày' : '14 days' },
                    { value: 21, label: language() == "Tiếng Việt" ? '21 ngày' : '21 days' },
                    { value: 30, label: language() == "Tiếng Việt" ? '30 ngày' : '30 days' },
                  ]}
                />
                <Select 
                  value={selectValue}
                  onChange={handleChange}
                  className="w-full sm:w-48"
                  options={[
                    { value: 'revenue', label: language() == "Tiếng Việt" ? 'Doanh thu' : 'Revenue' },
                    { value: 'newCustomers', label: language() == "Tiếng Việt" ? 'Khách hàng mới' : 'New customers' },
                    { value: 'ordersCount', label: language() == "Tiếng Việt" ? 'Số đơn hàng' : 'Orders count' },
                    { value: 'productsCount', label: language() == "Tiếng Việt" ? 'Sản phẩm bán' : 'Products sold' },
                  ]}
                />
                <ConfigProvider
                  button={{
                    className: styles.linearGradientButton,
                  }}
                >
                  <Button 
                    className="w-full sm:w-50"
                    type="primary"
                    onClick={DownloadFile}
                  >{language() == "Tiếng Việt" ? "Xuất danh sách thống kê" : "Export statistics list"}</Button>
                </ConfigProvider>
              </div>
            </div>
          
            {/* Responsive Chart Container */}
            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                <AreaChart 
                  width={Math.min(750, window.innerWidth - 40)} 
                  height={300} 
                  data={list?.dailyBreakdown}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6347" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffb3a7" stopOpacity={0.2} /> {/* Màu nhạt hơn của #ff6347 */}
                  </linearGradient>
                  <linearGradient id="customersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#90ee90" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#c1facc" stopOpacity={0.2} /> {/* Màu nhạt hơn của #90ee90 */}
                  </linearGradient>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffa500" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffcda3" stopOpacity={0.2} /> {/* Màu nhạt hơn của #ffa500 */}
                  </linearGradient>
                  <linearGradient id="productsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#800080" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#d4a0d4" stopOpacity={0.2} /> {/* Màu nhạt hơn của #800080 */}
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                {selectValue == "revenue" && <Area type="monotone" dataKey="revenue" stroke="#ff6347" fillOpacity={1} fill="url(#revenueGradient)"/>}
                {selectValue == "newCustomers" && <Area type="monotone" dataKey="newCustomers" stroke="#90ee90" fillOpacity={1} fill="url(#customersGradient)"/>}
                {selectValue == "ordersCount" && <Area type="monotone" dataKey="ordersCount" stroke="#ffa500" fillOpacity={1} fill="url(#ordersGradient)"/>}
                {selectValue == "productsCount" && <Area type="monotone" dataKey="productsCount" stroke="#800080" fillOpacity={1} fill="url(#productsGradient)"/>}
                </AreaChart>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg w-full lg:w-1/3 shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {language() == "Tiếng Việt" ? "Đơn hàng gần đây" : "Recent orders"}
            </h2>
            <p className="text-sm text-gray-500 mb-4 md:mb-6">
              {language() == "Tiếng Việt" ? "Cập nhật mới nhất" : "Latest updates"}
            </p>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {Array.isArray(recentOrders) && recentOrders.slice(0, 5).map((order, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 md:p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-slate-900 text-sm md:text-base">
                      #{order._id.slice(0, 8)}...
                    </h3>
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                      order.order_status === 4 ? 'bg-green-500' : 
                      order.order_status === 3 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs md:text-sm text-gray-500">
                      {formatDateFromISO(order.created_at)}
                    </span>
                    <span className="text-xs md:text-sm font-medium">
                      {formatCurrency(order.total_bill)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => handletoOrder()} 
              className="mt-4 md:mt-6 cursor-pointer w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium text-sm"
            >
              {language() == "Tiếng Việt" ? "Xem tất cả đơn hàng" : "View all orders"}
            </button>
          </div>
        </div>
        
        {/* Recent Orders */}
      </div>
    )
} 

export default MainManage;