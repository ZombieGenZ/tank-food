import { JSX, useEffect, useState } from "react";
import { Table, Input, Modal, InputNumber, Select } from 'antd';
import type { TableProps, GetProps } from 'antd';

interface DataType {
    key: string;
    displayname: string;
    email: string;
    phone: string;
    role: string;
    note: string[];
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
  const [data, setDataUser] = useState<DataType[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
    const newData = listuser.map((user, index) => ({
      key: String(index + 1),
      displayname: user.display_name,
      email: user.email,
      phone: user.phone,
      role: user.role === 3 ? "Admin" : user.role === 2 ? "Shipper" : user.role === 1 ? "Employee" : "Customer",
      note: ["Ban tài khoản"]
    }));
  
    setDataUser(newData);
  }, [listuser]);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Tên hiển thị',
      dataIndex: 'displayname',
      key: 'displayname',
      width: 350,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 350,
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      width: 450,
      key: 'phone',
    },
    {
      title: 'Quyền hạn',
      key: 'role',
      dataIndex: 'role',
      width: 250,
    },
    {
      title: 'Ghi chú',
      key: 'note',
      dataIndex: 'note',
      width: 350,
      render: (_, { note }) => (
        <>
          {note.map((noteitem) => {
            let color = noteitem.length > 5 ? 'geekblue' : 'green';
            if (noteitem === 'loser') {
              color = 'volcano';
            }
            return (
              <a color={color} 
                 key={noteitem}
                 onClick={showModal}>
                {noteitem}
              </a>
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
    const language = (): string => {
        const Language = localStorage.getItem('language')
        return Language ? JSON.parse(Language) : "Tiếng Việt"
    }
    return(
        <div className="p-10">
            <div className="w-full flex justify-center flex-col gap-10 items-center">
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
            <Modal title={language() == "Tiếng Việt" ? "Ban tài khoản" : "Ban account"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
              <div className="w-full flex gap-5">
                <InputNumber
                  min={1}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                />
                <Select
                  className="custom-select w-full"
                  popupClassName="custom-dropdown"
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2" },
                  ]}
                />
              </div>
            </Modal>
        </div>
    )
}

export default Account;