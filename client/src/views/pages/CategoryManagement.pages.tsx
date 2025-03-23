import { JSX, useEffect } from "react";
import { Space, Table, Tag, Input, Button } from 'antd';
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 350,
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: 350,
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: 450,
      key: 'address',
    },
    {
      title: 'Tags',
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
      title: 'Action',
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
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
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
                    <h1 className="font-bold text-2xl">{language() == "Tiếng Việt" ? "Quản lý danh mục" : "Category management"}</h1>
                </div>
                <div className="w-full flex justify-center flex-col items-cente gap-5">
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold">{language() == "Tiếng Việt" ? "Danh sách danh mục" : "Category list"}</p>
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