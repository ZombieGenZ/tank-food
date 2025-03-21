import { JSX } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card } from 'antd';

const { Meta } = Card;

function MainManage (): JSX.Element {
    const language = (): string => {
      const Language = localStorage.getItem('language')
      return Language ? JSON.parse(Language) : "Tiếng Việt"
    }
    const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
    const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));

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
        console.log(data)
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

    const data = [
        {
          "name": "Page A",
          "uv": 4000,
          "pv": 2400,
          "amt": 2400
        },
        {
          "name": "Page B",
          "uv": 3000,
          "pv": 1398,
          "amt": 2210
        },
        {
          "name": "Page C",
          "uv": 2000,
          "pv": 9800,
          "amt": 2290
        },
        {
          "name": "Page D",
          "uv": 2780,
          "pv": 3908,
          "amt": 2000
        },
        {
          "name": "Page E",
          "uv": 1890,
          "pv": 4800,
          "amt": 2181
        },
        {
          "name": "Page F",
          "uv": 2390,
          "pv": 3800,
          "amt": 2500
        },
        {
          "name": "Page G",
          "uv": 3490,
          "pv": 4300,
          "amt": 2100
        }
      ]
    return(
        <div className="w-4/5 bg-[#FFF4E6] p-10">
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex items-start">
                    <h1 className="font-bold text-2xl">Bảng điều khiển</h1>
                </div>
                <div className="w-full grid grid-cols-4 place-items-start">
                  <Card
                  hoverable
                  style={{
                      width: 250,
                      height: 100,
                      borderLeft: '5px solid #FF6B35', // Đổi màu viền
                      borderRadius: '10px', // Bo góc
                      backgroundColor: '#FFFFFF', // Màu nền
                      font: 'message-box',
                  }}
                  >
                    <div className="flex flex-col gap-5">
                      <Meta title={language() == "Tiếng Việt" ? "Tổng đơn hàng" : "Total bill"}/>
                      <p className="text-2xl">250 đơn</p>
                    </div>
                  </Card>
                  <Card
                  hoverable
                  style={{
                      width: 250,
                      height: 100,
                      borderLeft: '5px solid #FF6B35', // Đổi màu viền
                      borderRadius: '10px', // Bo góc
                      backgroundColor: '#FFFFFF', // Màu nền
                      font: 'message-box'
                  }}
                  >
                    <div className="flex flex-col gap-5">
                      <Meta title={language() == "Tiếng Việt" ? "Doanh thu trong tháng" : "Total bill"}/>
                      <p className="text-2xl">250</p>
                    </div>
                  </Card>
                  <Card
                  hoverable
                  style={{
                      width: 250,
                      height: 100,
                      borderLeft: '5px solid #FF6B35', // Đổi màu viền
                      borderRadius: '10px', // Bo góc
                      backgroundColor: '#FFFFFF', // Màu nền
                      font: 'message-box'
                  }}
                  >
                    <div className="flex flex-col gap-5">
                      <Meta title={language() == "Tiếng Việt" ? "Sản phẩm đang bán" : "Total bill"}/>
                      <p className="text-2xl">250</p>
                    </div>
                  </Card>
                  <Card
                  hoverable
                  style={{
                      width: 250,
                      height: 100,
                      borderLeft: '5px solid #FF6B35', // Đổi màu viền
                      borderRadius: '10px', // Bo góc
                      backgroundColor: '#FFFFFF', // Màu nền
                      font: 'message-box'
                  }}
                  >
                    <div className="flex flex-col gap-5">
                      <Meta title={language() == "Tiếng Việt" ? "Khách hàng mới" : "Total bill"}/>
                      <p className="text-2xl">250</p>
                    </div>
                  </Card>
                </div>
                <div className="w-full grid grid-cols-2">
                    <LineChart width={500} height={500} data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                    <div className="bg-white rounded-2xl shadow-xl p-4 font-bold flex flex-col gap-4">
                        <h2 className="text-[#FF7846]">Đơn hàng gần đây</h2>
                        <hr className="text-gray-300"/>
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default MainManage;