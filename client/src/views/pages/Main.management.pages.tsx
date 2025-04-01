import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Verify from '../components/VerifyToken.components';
import { message, Select } from "antd";

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

function MainManage (): JSX.Element {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [list, setList] = useState<StatisticalData|null>(null)
    const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
    const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
    const [selectValue, setSelectValue] = useState<string>("revenue")
    const [selectDate, setSelectDate] = useState<number>(7)

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

    // const recentOrders = [
    //   { id: '12345', date: '21/03/2025', amount: '2.350.000₫', status: 'completed' },
    //   { id: '12344', date: '20/03/2025', amount: '1.750.000₫', status: 'processing' },
    //   { id: '12343', date: '19/03/2025', amount: '3.120.000₫', status: 'pending' }
    // ];

    useEffect(() => {
      const checkToken = async () => {
        const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
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
        } else {
          messageApi.error("Token không hợp lệ!");
        }
    };
    
    checkToken();
    }, [refresh_token, access_token, messageApi, selectDate])

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
      console.log(recentOrders)
      console.log(list)
    }, [recentOrders, list])

    function formatCurrency(amount: number, currencyCode = 'vi-VN', currency = 'VND') {
      const formatter = new Intl.NumberFormat(currencyCode, {
        style: 'currency',
        currency: currency,
      });
      return formatter.format(amount);
    }

    return(
      <div className="flex-1 overflow-auto">
      {/* Dashboard Header */}
      {contextHolder}
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 p-6">
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
                  <span className="text-gray-500 text-xs">{language() == "Tiếng Việt" ? "sản phẩm" : "sản phẩm"}</span>
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
                  <span className="text-xl font-bold text-slate-900 mr-1">{list?.totalRevenue}</span>
                  <span className="text-gray-500 text-xs">{language() == "Tiếng Việt" ? "VNĐ" : "VNĐ"}</span>
                </div>
                <div className={`mt-1 text-xs ${list?.comparison.totalRevenueChange ? 'text-green-600' : 'text-red-600'}`}>
                  {list?.comparison.totalRevenueChange} {list?.comparison.totalRevenueChange ? '↑' : '↓'}
                </div>
              </div>
            </div>
          </div>
      </div>
      
      {/* Charts and Orders Section */}
      <div className="flex gap-6 p-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg w-[125%] shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Biểu đồ doanh thu</h2>
              <p className="text-sm text-gray-500">1 tháng gần đây</p>
            </div>
            <div className="flex items-center space-x-4 gap-5">
              <Select 
                value={selectDate}
                onChange={handleChangeDate}
                options={[
                  { value: 7 , label: '7 ngày',},
                  { value: 14 , label: '14 ngày',},
                  { value: 21 , label: '21 ngày',},
                  { value: 30 , label: '30 ngày',},
                ]}
              />
              <Select 
                value={selectValue}
                onChange={handleChange}
                options={[
                  { value: 'revenue' , label: 'Doanh thu',},
                  { value: 'newCustomers' , label: 'Khách hàng mới',},
                  { value: 'ordersCount' , label: 'Số đơn đặt hàng',},
                  { value: 'productsCount' , label: 'Số sản phẩm bán được',},
                ]}
              />
              {/* <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs text-gray-500">Doanh thu</span>
              </div> */}
              {/* <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-500">Lợi nhuận</span>
              </div> */}
            </div>
          </div>
          
          <AreaChart width={750} height={500} data={list?.dailyBreakdown}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6347" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1e90ff" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="customersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#90ee90" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f0e68c" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffa500" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffe4b5" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="productsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#800080" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#dda0dd" stopOpacity={0.2} />
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
        
        {/* Recent Orders */}
        <div className="bg-white rounded-lg w-[75%] shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Đơn hàng gần đây</h2>
          <p className="text-sm text-gray-500 mb-6">Cập nhật mới nhất</p>
          
          <div className="space-y-4">
            {Array.isArray(recentOrders) && recentOrders.map((order, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-slate-900">Đơn hàng #{order._id}</h3>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3b82f6" }}></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">{order.created_at}</span>
                  <span className="text-sm font-medium">{formatCurrency(order.total_bill)}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={() => navigate('/order')} className="mt-6 w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium text-sm">
            Xem tất cả đơn hàng
          </button>
        </div>
      </div>
    </div>
    )
} 

export default MainManage;