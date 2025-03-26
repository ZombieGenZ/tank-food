import { JSX, useState, useEffect } from "react";
import { Table, Input, Button } from 'antd';
import type { TableProps, GetProps } from 'antd';

interface DataType {
    key: string,
    code: string,
    quantity: number,
    discount: string,
    requirement: number,
    expiration_date: string,
    note: string[],
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
    const [data, setData] = useState<DataType[]>([]);
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
            key: String(index + 1),
            code: voucherV.code,
            quantity: voucherV.quantity,
            discount: voucherV.discount.toLocaleString('vi-VN') + " VNĐ",
            requirement: voucherV.requirement,
            expiration_date: voucherV.expiration_date,
            note: ["Chỉnh sửa"]
        }))

        setData(newData)
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
              title: 'Mã giảm giá',
              dataIndex: 'code',
              key: 'code',
              width: 350,
              render: (text) => <p className="font-bold">{text}</p>,
            },
            {
                title: 'Số lượng mã giảm giá',
                dataIndex: 'quantity',
                width: 350,
                key: 'quantity',
            },
            {
              title: 'Số tiền được giảm',
              dataIndex: 'discount',
              width: 350,
              key: 'discount',
            },
            {
                title: 'Yêu cầu tối thiểu đơn hàng từ',
                key: 'requirement',
                dataIndex: 'requirement',
                width: 350,
            },
            {
              title: 'Thời gian hết hạn',
              key: 'expiration_date',
              dataIndex: 'expiration_date',
              width: 350,
            },
            {
                title: '',
                key: 'note',
                width: 350,
                render: (_, { note }) => (
                        <>
                          {note.map((noteitem) => {
                            return (
                              <Button 
                                      key={noteitem}>
                                {noteitem}
                              </Button>
                            );
                          })}
                        </>
                ),
              },
          ];
    
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