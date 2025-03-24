import { JSX, useState } from "react";
import { Card, Select, Button } from "antd";

const { Option } = Select;

const ShipManagement = (): JSX.Element => {
    const [selectedFilter, setSelectedFilter] = useState("Tháng này");
    const orders = [
        {
          id: "00001",
          name: "Gà chín cửa",
          price: "10.000 vnd",
          status: "Đang giao",
          date: "00:00 01/01/2025",
        },
        {
          id: "00002",
          name: "Gà chín cửa",
          price: "10.000 vnd",
          status: "Đang giao",
          date: "00:00 01/01/2025",
        },
      ];
    const language = (): string => {
        const Language = localStorage.getItem('language')
        return Language ? JSON.parse(Language) : "Tiếng Việt"
    }
    return(
        <div className="w-4/5 bg-[#FFF4E6] p-10">
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex items-start">
                    <h1 className="font-bold text-2xl">{language() == "Tiếng Việt" ? "Quản lý giao hàng" : "Delivery management"}</h1>
                </div>
                <div className="w-full flex justify-center flex-col items-center gap-5">
                    <div className="w-full flex items-center justify-between">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Danh sách đơn hàng đang giao" : "List of orders being delivered"}</p>
                        <Select
                            className="w-[15%]"
                            value={selectedFilter}
                            onChange={setSelectedFilter}
                            >
                            <Option value="Tháng này">Tháng này</Option>
                            <Option value="Tháng trước">Tháng trước</Option>
                            <Option value="Tuần trước">Tuần trước</Option>
                            <Option value="Tuần này">Tuần này</Option>
                        </Select>
                    </div>

                    {orders.map((order) => (
                        <Card key={order.id} className="mb-4 w-full" title={`Đơn #${order.id}`} extra={<span className="text-sm text-gray-500">{order.date}</span>}>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-600">X</span>
                                </div>
                                <div className="flex-1">
                                <p className="font-medium">{order.name}</p>
                                <p className="text-gray-500 text-sm">{order.price}</p>
                                </div>
                                <span className="border rounded px-3 py-1">X1</span>
                            </div>
                            <p className="mt-2 text-sm">
                                Trạng thái đơn hàng: <span className="text-blue-500">{order.status}</span>
                            </p>
                            <Button className="mt-3" type="default">
                                Chi tiết đơn hàng
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ShipManagement;