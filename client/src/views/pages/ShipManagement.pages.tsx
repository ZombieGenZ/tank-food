import { JSX, useState, useEffect } from "react";
import { Card, Select, Button } from "antd";

const { Option } = Select;

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

const ShipManagement = (): JSX.Element => {
    const [selectedFilter, setSelectedFilter] = useState("Tháng này");
    const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
    const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));

    const [billwait, setBillwait] = useState<Order[]>([])
    const [billtaked, setBilltaked] = useState<Order[]>([])

    useEffect(() => {
        console.log(billwait)
        console.log(billtaked)
    }, [billwait, billtaked])

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
                setBillwait(data.order)
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
                setBilltaked(data.order)
            }
        })
    }, [refresh_token, access_token])

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
        <div className=" p-10">
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex justify-center flex-col items-center gap-5">
                    <div className="w-full flex items-center justify-between">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Danh sách đơn hàng chưa nhận giao hàng" : "List of orders not yet delivered"}</p>
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