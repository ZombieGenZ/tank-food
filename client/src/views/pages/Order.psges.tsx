import { JSX } from "react";
import { Space, Table, Tag, Input, Button } from 'antd';
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
          title: 'Tên hiển thị',
          dataIndex: 'name',
          key: 'name',
          width: 350,
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Email',
          dataIndex: 'age',
          width: 350,
          key: 'age',
        },
        {
          title: 'Số điện thoại',
          dataIndex: 'address',
          width: 450,
          key: 'address',
        },
        {
          title: 'Quyền hạn',
          key: 'tags',
          dataIndex: 'tags',
          width: 250,
          render: (_, { tags }) => (
            <>
              {tags.map((tag) => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
          title: 'Ghi chú',
          key: 'action',
          width: 350,
          render: (_, record) => (
            <Space size="middle">
              <a>Invite {record.name}</a>
              <a>Delete</a>
            </Space>
          ),
        },
      ];
      
      const data: DataType[] = [
        
      ];

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
                <div className="w-full flex justify-center flex-col items-cente gap-5">
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold">{language() == "Tiếng Việt" ? "Danh sách sản phẩm" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Button>{language() == "Tiếng Việt" ? "Tạo" : "Create"}</Button>
                            <Search placeholder={language() == "Tiếng Việt" ? "Tìm kiếm danh mục theo tên" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <App />
                    </div>
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold">{language() == "Tiếng Việt" ? "Danh sách sản phẩm" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Button>{language() == "Tiếng Việt" ? "Tạo" : "Create"}</Button>
                            <Search placeholder={language() == "Tiếng Việt" ? "Tìm kiếm danh mục theo tên" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <App />
                    </div>
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold">{language() == "Tiếng Việt" ? "Danh sách sản phẩm" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Button>{language() == "Tiếng Việt" ? "Tạo" : "Create"}</Button>
                            <Search placeholder={language() == "Tiếng Việt" ? "Tìm kiếm danh mục theo tên" : "Search category by name"} onSearch={onSearch} enterButton />
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <App />
                    </div>
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold">{language() == "Tiếng Việt" ? "Danh sách sản phẩm" : "Product list"}</p>
                        <div className="w-[30%] flex gap-2">
                            <Button>{language() == "Tiếng Việt" ? "Tạo" : "Create"}</Button>
                            <Search placeholder={language() == "Tiếng Việt" ? "Tìm kiếm danh mục theo tên" : "Search category by name"} onSearch={onSearch} enterButton />
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