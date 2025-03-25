import { JSX, useState, useEffect } from "react";
import { Table, Input, Button } from 'antd';
import type { TableProps, GetProps } from 'antd';

interface DataType {
    key: string;
    
}

interface Voucher {
    code: string;
    created_at: string; // Hoặc Date nếu bạn muốn chuyển đổi khi sử dụng
    discount: number;
    expiration_date: string; // Hoặc Date nếu bạn muốn chuyển đổi khi sử dụng
    quantity: number;
    requirement: number;
    updated_at: string; // Hoặc Date nếu bạn muốn chuyển đổi khi sử dụng
    used: number | null; // Giả sử used là số lượng voucher đã sử dụng, nếu null có thể chưa có dữ liệu
    _id: string;
}

const DiscountCodeManagement = (): JSX.Element => {
    const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
    const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
    const [voucher, setVoucher] = useState<Voucher[]>([])
    const language = (): string => {
        const Language = localStorage.getItem('language')
        return Language ? JSON.parse(Language) : "Tiếng Việt"
    }
    useEffect(() => {
        const body = {
            language: null,
            refresh_token: refresh_token,
        }
        fetch(`${import.meta.env.VITE_API_URL}/api/voucher-public/get-voucher`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json()
        }).then((data) => {
            setVoucher(data.voucher)
            console.log(data)
        })
    }, [refresh_token, access_token])

    useEffect(() => {
        const newData: DataType[] = voucher.map((voucherV, index) => ({
            
        }))

        setVoucher(newData)
    }, [voucher])

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
    const columns: TableProps<DataType>['columns'] = [
            {
              title: 'Mã đơn hàng',
              dataIndex: 'name',
              key: 'name',
              width: 350,
            },
            {
              title: 'Tổng tiền đơn hàng',
              dataIndex: 'age',
              width: 350,
              key: 'age',
            },
            {
              title: 'Thời gian đặt hàng',
              dataIndex: 'address',
              width: 350,
              key: 'address',
            },
            {
              title: 'Trạng thái đơn hàng',
              key: 'tags',
              dataIndex: 'tags',
              width: 350,
            }
          ];
          
          const data: DataType[] = [];
    
          const App: React.FC = () => <Table<DataType> className="w-full" columns={columns} dataSource={data} />;
          type SearchProps = GetProps<typeof Input.Search>;
    
          const { Search } = Input;
              
          const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
    return(
        <div className=" p-10">
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex justify-center flex-col items-center gap-5">
                    <div className="w-full flex justify-between items-end">
                    <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Quản lý mã giảm giá" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Button>{language() == "Tiếng Việt" ? "Tạo" : "Create"}</Button>
                            <Search placeholder={language() == "Tiếng Việt" ? "Tìm mã giảm giá theo mã code" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <App />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DiscountCodeManagement;