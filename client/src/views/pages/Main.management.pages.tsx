import { JSX, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calendar } from 'lucide-react';
import { Select, Dropdown } from "antd";
import type { MenuProps } from 'antd';
import { FaRegUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { MdAccountBox } from "react-icons/md";

interface StatisticalData {
  dailyBreakdown: DailyBreakdown[];
  totalNewCustomers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

interface DailyBreakdown {
  date: string; // Ngày dạng "dd/MM/yyyy"
  newCustomers: number;
  ordersCount: number;
  productsCount: number;
  revenue: number;
}

function MainManage (): JSX.Element {

    const [language, setLanguage] = useState<string>(() => {
      const SaveedLanguage = localStorage.getItem('language')
      return SaveedLanguage ? JSON.parse(SaveedLanguage) : "Tiếng Việt"
    })
    const [list, setList] = useState<StatisticalData[]>([])
    const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
    const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));

    const stats = [
      { id: 1, title: 'Tổng đơn hàng', value: 250, unit: 'đơn', change: '+12%', increased: true, color: '#f97316' },
      { id: 2, title: 'Doanh thu tháng', value: '35.5M', unit: '₫', change: '+8.2%', increased: true, color: '#3b82f6' },
      { id: 3, title: 'Sản phẩm đang bán', value: 184, unit: 'sản phẩm', change: '-2.5%', increased: false, color: '#22c55e' },
      { id: 4, title: 'Khách hàng mới', value: 34, unit: 'khách', change: '+5.9%', increased: true, color: '#a855f7' }
    ];
  
    const recentOrders = [
      { id: '12345', date: '21/03/2025', amount: '2.350.000₫', status: 'completed' },
      { id: '12344', date: '20/03/2025', amount: '1.750.000₫', status: 'processing' },
      { id: '12343', date: '19/03/2025', amount: '3.120.000₫', status: 'pending' }
    ];
  
    const chartData = [
      { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
      { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
      { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
      { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
      { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
      { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
      { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
    ];
  
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed': return '#22c55e';
        case 'processing': return '#f97316';
        case 'pending': return '#3b82f6';
        default: return '#64748b';
      }
    };  

    useEffect(() => {
      const body = {
        language: null,
        refresh_token: refresh_token,
        time: 0,
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
    }, [refresh_token, access_token])

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
      console.log(list)
    }, [list])

    const handleChange = (value: string) => {
        setLanguage(value)
        localStorage.setItem('language', JSON.stringify(value))
        if(value == "Tiếng Việt") {
          localStorage.setItem('code_language', JSON.stringify("vi-VN"))
        } else {
          localStorage.setItem('code_language', JSON.stringify("en-US"))
        }
        window.location.reload()
      };
    
      const items: MenuProps['items'] = [
        {
          key: '1',
          label: (
            <button
              className='flex gap-2 items-center'
            ><FaRegUserCircle /> Thông tin tài khoản</button>
          ),
        },
        {
          key: '2',
          label: (
            <button
              className='flex gap-2 items-center'
            ><IoLogOutOutline /> Đăng xuất</button>
          ),
        },
      ];

    return(
      <div className="flex-1 overflow-auto">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900">Bảng điều khiển</h1>
        <div className="flex items-center gap-5">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-500" />
            <span className="text-sm text-gray-500">24/03/2025</span>
          </div>
          <Select
            defaultValue={language}
            size='small'
            options={[{ value: 'Tiếng Việt', label: 'Tiếng Việt - VI' },
                      { value: 'English', label: 'English - EN' },
                    ]}
            onChange={handleChange}
          />
          <Dropdown menu={{ items }} 
                    placement="bottom">
            <div className='text-[#FF7846] bg-white p-2 rounded-2xl hover:text-white hover:bg-[#FF7846] transition duration-300'>
              <MdAccountBox />
            </div>
          </Dropdown>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 p-6">
        {stats.map(stat => (
          <div key={stat.id} className="bg-white rounded-lg shadow-sm p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bottom-0 left-0 opacity-5" style={{ backgroundColor: stat.color }}></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stat.color }}></div>
                </div>
                <span className="text-gray-500 text-sm">{stat.title}</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-slate-900 mr-1">{stat.value}</span>
                <span className="text-gray-500 text-xs">{stat.unit}</span>
              </div>
              <div className={`mt-1 text-xs ${stat.increased ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} {stat.increased ? '↑' : '↓'}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts and Orders Section */}
      <div className="grid grid-cols-2 gap-6 p-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Biểu đồ doanh thu</h2>
              <p className="text-sm text-gray-500">6 tháng gần đây</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs text-gray-500">Doanh thu</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-500">Lợi nhuận</span>
              </div>
            </div>
          </div>
          
          <LineChart width={500} height={250} data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Đơn hàng gần đây</h2>
          <p className="text-sm text-gray-500 mb-6">Cập nhật mới nhất</p>
          
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-slate-900">Đơn hàng #{order.id}</h3>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(order.status) }}></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">{order.date}</span>
                  <span className="text-sm font-medium">{order.amount}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-6 w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium text-sm">
            Xem tất cả đơn hàng
          </button>
        </div>
      </div>
    </div>
    )
} 

export default MainManage;