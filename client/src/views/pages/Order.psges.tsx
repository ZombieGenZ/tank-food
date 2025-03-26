import { JSX, useState, useEffect } from "react";
import { Table, Input } from 'antd';
import type { TableProps, GetProps } from 'antd';

interface DataType {
    key: string;
    id: string,
    total_price: string,
    date: string,
    status: string,
    payment: string,
    local?: string,
}

interface Order {
    canceled_at: string;
    canceled_by: string | null;
    cancellation_reason: string;
    completed_at: string | null;
    confirmmed_at: string;
    created_at: string;
    delivered_at: string;
    delivering_at: string;
    delivery_address: string;
    delivery_latitude: number;
    delivery_longitude: number;
    delivery_nation: string;
    delivery_type: string | null;
    discount_code: string | null;
    distance: number;
    email: string;
    estimated_time: string;
    fee: number;
    is_first_transaction: boolean;
    moderated_by: string | null;
    name: string;
    node: string | null;
    order_status: number;
    payment_status: number;
    payment_type: number;
    phone: string;
    product: Product[];
    receiving_address: string;
    receiving_latitude: number;
    receiving_longitude: number;
    receiving_nation: string;
    shipper: string | null;
    suggested_route: string;
    total_bill: number;
    total_price: number;
    total_quantity: number;
    updated_at: string;
    user: string;
    vat: number;
    _id: string;
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

const OrderManagement = (): JSX.Element => {
    const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
    const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
    const [waitData, setWaitData] = useState<Order[]>([])
    const [doneData, setDoneData] = useState<Order[]>([])
    const [waitView, setWaitView] = useState<DataType[]>([])
    const [doneView, setDoneView] = useState<DataType[]>([])
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
        if (!Array.isArray(waitData)) {
            console.error("waitData is not an array:", waitData);
            return;
        }
        const newWaitView: DataType[] = waitData.map((bill, index) => ({
            key: String(index + 1),
            id: bill._id,
            total_price: bill.total_bill.toString(),
            date: bill.created_at,
            status: bill.order_status === 0 ? "Đang chờ duyệt" : 
                    bill.order_status === 1 ? "Duyệt thành công" : 
                    bill.order_status === 2 ? "Đang giao" : 
                    bill.order_status === 3 ? "Giao đơn thành công" : 
                    bill.order_status === 4 ? "Thành công" : "Thất bại",
            payment: bill.payment_status === 0 ? "Đang chờ thanh toán" :
                     bill.payment_status === 1 ? "Thanh toán thành công" : "Thanh toán thất bại",
            local: bill.receiving_address,
        }))

        const newDoneView: DataType[] = doneData.map((bill, index) => ({
            key: String(index + 1),
            id: bill._id,
            total_price: bill.total_bill.toString(),
            date: bill.created_at,
            status: bill.order_status === 0 ? "Đang chờ duyệt" : 
                    bill.order_status === 1 ? "Duyệt thành công" : 
                    bill.order_status === 2 ? "Đang giao" : 
                    bill.order_status === 3 ? "Giao đơn thành công" : 
                    bill.order_status === 4 ? "Thành công" : "Thất bại",
            payment: bill.payment_status === 0 ? "Đang chờ thanh toán" :
                     bill.payment_status === 1 ? "Thanh toán thành công" : "Thanh toán thất bại",
            local: bill.receiving_address,
        }))

        setWaitView(newWaitView)
        setDoneView(newDoneView)
    }, [waitData, doneData])

    const columns: TableProps<DataType>['columns'] = [
        {
          title: 'Mã đơn hàng',
          dataIndex: 'id',
          key: 'id',
          width: 350,
          render: (text) => <p className="font-bold">{text}</p>,
        },
        {
          title: 'Tổng tiền đơn hàng',
          dataIndex: 'total_price',
          width: 350,
          key: 'total_price',
        },
        {
          title: 'Thời gian đặt hàng',
          dataIndex: 'date',
          width: 350,
          key: 'date',
        },
        {
            title: 'Trạng thái đơn hàng',
            key: 'status',
            dataIndex: 'status',
            width: 350,
        },
        {
            title: 'Thanh toán',
            key: 'payment',
            dataIndex: 'payment',
            width: 350,
        },
        {
            title: 'Địa chỉ giao hàng',
            key: 'local',
            dataIndex: 'local',
            width: 350,
        },
      ];
      

      const WaitTable: React.FC = () => <Table<DataType> className="w-full" columns={columns} dataSource={waitView} pagination={{ pageSize: 5 }}/>;
      const DoneTable: React.FC = () => <Table<DataType> className="w-full" columns={columns} dataSource={doneView} pagination={{ pageSize: 5 }}/>;
      type SearchProps = GetProps<typeof Input.Search>;

      const { Search } = Input;
          
      const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
      
    const language = (): string => {
        const Language = localStorage.getItem('language')
        return Language ? JSON.parse(Language) : "Tiếng Việt"
    }
    return(
        <div className="p-10">   
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex justify-center flex-col items-center gap-5">
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Đơn đặt hàng đang chờ duyệt" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Search placeholder={language() == "Tiếng Việt" ? "Đơn đặt hàng đang chờ duyệt" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <WaitTable />
                    </div>
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Đơn đặt hàng đã duyệt" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Search placeholder={language() == "Tiếng Việt" ? "Đơn đặt hàng đã duyệt" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <DoneTable />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderManagement