import { JSX, useEffect, useState } from "react";
import { Space, Table, Tag, Input } from 'antd';
import type { TableProps, GetProps } from 'antd';

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }

  interface Penalty {
    created_by: string;
    expired_at: string;
    reason: string;
  }
  
  interface User {
    _id: string;
    display_name: string;
    email: string;
    phone: string;
    role: number;
    user_type: number;
    created_at: string;
    updated_at: string;
    penalty?: Penalty; // Dấu ? để chỉ rằng có thể không có penalty
  }
  

const Account = (): JSX.Element => {
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [listuser, setListuser] = useState<User[]>([]);

  useEffect(() => {
    const body = {
      language: null,
      refresh_token: refresh_token
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/account-management/get-account`, {
      method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(body)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      setListuser(data.account)
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
    console.log(listuser)
  }, [listuser])

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
                    <h1 className="font-bold text-2xl">{language() == "Tiếng Việt" ? "Quản lý tài khoản" : "Account management"}</h1>
                </div>
                <div className="w-full flex justify-center flex-col items-cente gap-5">
                    <div className="w-full flex justify-between items-end">
                        <p className="font-bold">{language() == "Tiếng Việt" ? "Danh sách tài khoản" : "Account list"}</p>
                        <div className="w-[25%]">
                            <Search placeholder={language() == "Tiếng Việt" ? "Tìm kiếm tài khoản theo tên" : "Search account by name"} onSearch={onSearch} enterButton />
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

export default Account;