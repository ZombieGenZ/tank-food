import { JSX, useEffect } from "react";
import { Space, Table, Input, Button } from 'antd';
import type { TableProps, GetProps } from 'antd';

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

const CategoryManagement = (): JSX.Element => {
  useEffect(() => {
    const body = {
      language: null,
    } 
    fetch(`${import.meta.env.VITE_API_URL}/api/categories/get-category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data)
    })
  }, [])
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Danh mục',
      dataIndex: 'name',
      key: 'name',
      width: 350,
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'age',
      width: 350,
      key: 'age',
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
        <div className="p-10">   
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex justify-center flex-col items-cente gap-5">
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold text-[#FF7846]">{language() == "Tiếng Việt" ? "Danh sách danh mục" : "Category list"}</p>
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

export default CategoryManagement;