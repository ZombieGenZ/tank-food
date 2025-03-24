import { JSX } from "react";
import { Table, Input, Button } from 'antd';
import type { TableProps, GetProps } from 'antd';

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

const OrderManagement = (): JSX.Element => {
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
      
    const language = (): string => {
        const Language = localStorage.getItem('language')
        return Language ? JSON.parse(Language) : "Tiếng Việt"
    }
    return(
        <div className="w-4/5 bg-[#FFF4E6] p-10">   
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex items-start">
                    <h1 className="font-bold text-2xl">{language() == "Tiếng Việt" ? "Quản lý đơn đặt hàng" : "Order management"}</h1>
                </div>
                <div className="w-full flex justify-center flex-col items-center gap-5">
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Đơn đặt hàng online đang chờ duyệt" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Button>{language() == "Tiếng Việt" ? "Tạo" : "Create"}</Button>
                            <Search placeholder={language() == "Tiếng Việt" ? "Đơn đặt hàng online đang chờ duyệt" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <App />
                    </div>
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Đơn đặt hàng online đã duyệt" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Button>{language() == "Tiếng Việt" ? "Tạo" : "Create"}</Button>
                            <Search placeholder={language() == "Tiếng Việt" ? "Đơn đặt hàng online đã duyệt" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <App />
                    </div>
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Đơn đặt hàng offline đang chờ duyệt" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Button>{language() == "Tiếng Việt" ? "Tạo" : "Create"}</Button>
                            <Search placeholder={language() == "Tiếng Việt" ? "Đơn đặt hàng offline đang chờ duyệt" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <App />
                    </div>
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Đơn đặt hàng offline đã duyệt" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Button>{language() == "Tiếng Việt" ? "Tạo" : "Create"}</Button>
                            <Search placeholder={language() == "Tiếng Việt" ? "Đơn đặt hàng offline đã duyệt" : "Search category by name"} onSearch={onSearch} enterButton />
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

export default OrderManagement