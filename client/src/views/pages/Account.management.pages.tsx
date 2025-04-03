import { useEffect, useState } from "react";
import { Table, Input, Modal, InputNumber, Select, Button, message } from 'antd';
import type { TableProps } from 'antd';

interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DataType {
    key: string;
    _id: string;
    displayname: string;
    email: string;
    phone: string;
    role: string;
    active: string;
    reason?: string;
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
  

const Account: React.FC<Props> = (props) => {
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [listuser, setListuser] = useState<User[]>([]);
  const [data, setDataUser] = useState<DataType[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalActiveOpen, setIsModalActiveOpen] = useState(false);
  const [hours, setHours] = useState<number|null>(1);
  const [timeUnit, setTimeUnit] = useState("h");
  const [banReason, setBanReason] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = (value: DataType) => {
    setSelectedRecord(value);
    setIsModalOpen(true);
  };

  const showActiveModal = (value: DataType) => {
    setSelectedRecord(value);
    setIsModalActiveOpen(true);
  };

  const handleChangHour = (e: number|null): void => {
    if(e === null) return;
    setHours(e);
  }

  const handleActiveOk = (id: string) => {
    const body = { 
      language: null,
      refresh_token: refresh_token,
      user_id: id
    };
    
    fetch(`${import.meta.env.VITE_API_URL}/api/account-management/unban-account`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body)
    }).then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data)
      if(data.message == "Mở khóa tài khoản thành công"){
        messageApi.open({
          type: 'success',
          content: 'Mở khóa tài khoản thành công',
          style: {
            marginTop: '10vh',
          },
        }).then(() => {
          setIsModalActiveOpen(false);
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
        })
      }
    })
  }

  const handleOk = (id: string) => {
    if (hours === null || hours < 1) {
      messageApi.open({
        type: 'error',
        content: 'Số giờ ban phải lớn hơn 1',
        style: {
          marginTop: '10vh',
        },
      });
      return;
    }
    if (!banReason.trim()) {
      messageApi.open({
        type: 'error',
        content: 'Không được để trống lý do ban',
        style: {
          marginTop: '10vh',
        },
      })
      return;
    }

    // Xử lý dữ liệu nếu hợp lệ
    console.log("Dữ liệu gửi đi:", { hours, timeUnit, banReason });

    const body = {
      language: null,
      refresh_token: refresh_token,
      user_id: id,
      reason: banReason,
      time: hours + timeUnit,
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/account-management/ban-account`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body)
    }).then((response) => {
      return response.json()
    }
    ).then((data) => {  
      console.log(data)
      if(data.message == "Khóa tài khoản thành công"){
        messageApi.open({
          type: 'success',
          content: 'Ban tài khoản thành công',
          style: {
            marginTop: '10vh',
          },
        }).then(() => {
          setIsModalOpen(false);
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
        }) 
      }
    })
  };

  const handleActiveCancel = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Xử lý chọn đơn vị thời gian
  const handleChangeTimeUnit = (value: string) => {
    setTimeUnit(value);
  };

  // Xử lý nhập lý do ban
  const handleChangeReason = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBanReason(e.target.value);
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
      _id: user._id,
      displayname: user.display_name,
      email: user.email,
      phone: user.phone,
      role: user.role === 3 ? "Admin" : user.role === 2 ? "Shipper" : user.role === 1 ? "Employee" : "Customer",
      active: user.penalty ? "Bị ban" : "Hoạt động",
      readson: user.penalty !== null ? user.penalty?.reason : "Không có lý do",
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
      render: (text) => <p className="font-bold">{text}</p>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      width: 350,
      key: 'phone',
    },
    {
      title: 'Quyền hạn',
      key: 'role',
      dataIndex: 'role',
      width: 250,
    },
    {
      title: 'Tình trang hoạt động',
      key: 'active',
      dataIndex: 'active',
      width: 250,
      render: (text) => <p className={text === "Hoạt động" ? "text-green-500 bg-green-200 p-2 flex justify-center rounded-xl" : "text-red-500 bg-red-200 p-2 flex justify-center rounded-xl"}>{text}</p>,
    },
    {
      title: '',
      key: 'note',
      dataIndex: 'note',
      width: 250,
      render: (_text, record) => {
        const isDisabled = record.role === "Admin";
        let color: string;
        if(isDisabled) 
          { 
            color = "gray"
          }
        else if(record.active == "Hoạt động")
          { 
            color = "red"
          }
        else
          { 
            color = "green"
         }
        return (
        <>
          {record.active == "Hoạt động" ? record.note.map((noteitem, index) => (
            <Button key={index} style={{ color: color }} onClick={() => showModal(record)} disabled={isDisabled}>
              {noteitem}
            </Button>
          )) : 
            <Button key={1} style={{ color: color }} onClick={() => showActiveModal(record)} disabled={isDisabled}>
              Mở khoá tài khoản
            </Button>
          }
        </>
      )},
    },
  ];
  
  const language = (): string => {
    const language = localStorage.getItem('language')
    return language ? JSON.parse(language) : "Tiếng Việt"
  }
  
  const App: React.FC = () => <Table<DataType> className="w-full" columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />;
    
    return(
        <div className="p-10">
            {contextHolder}
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex justify-center flex-col items-cente gap-5">
                    <div className="w-full overflow-x-auto">
                        <App />
                    </div>
                </div>
            </div>
            <Modal title={language() == "Tiếng Việt" ? "Ban tài khoản" : "Ban account"} open={isModalOpen} okText="Ban tài khoản" onOk={() => handleOk(`${selectedRecord ? selectedRecord._id : ""}`)} onCancel={handleCancel}>
              <div className="w-full flex gap-5">
                {selectedRecord && (
                  <div className="w-full flex flex-col gap-5">
                    <div className="flex gap-3 flex-col">
                      <p>Id user:</p>
                      <Input value={selectedRecord._id} readOnly/>
                    </div>
                    <div className="flex gap-3 flex-col">
                      <p>Tên hiển thị:</p>
                      <Input value={selectedRecord.displayname} readOnly/>
                    </div>
                    <div className="flex gap-3 flex-col">
                      <p>Email:</p>
                      <Input value={selectedRecord.email} readOnly/>
                    </div>
                    <div className="flex gap-3 flex-col">
                      <p>Thời gian ban:</p>
                      <div className="flex gap-3">
                        <InputNumber
                          onChange={handleChangHour}
                          value={hours}
                          min={1}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                        />
                        <Select
                          className="custom-select w-full"
                          popupClassName="custom-dropdown"
                          value={timeUnit}
                          onChange={handleChangeTimeUnit}
                          options={[
                            { value: "h", label: "giờ" },
                            { value: "d", label: "ngày" },
                            { value: "w", label: "tuần" },
                            { value: "mo", label: "tháng" },
                            { value: "y", label: "năm" },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 flex-col">
                      <p>Lý do ban:</p>
                      <Input value={banReason} onChange={handleChangeReason}/>
                    </div>
                  </div>
                )}
              </div>
            </Modal>
            <Modal title={language() == "Tiếng Việt" ? "Mở khoá tài khoản" : "Active account"} open={isModalActiveOpen} okText="Mở khoá" onOk={() => handleActiveOk(`${selectedRecord ? selectedRecord._id : ""}`)} onCancel={handleActiveCancel}>
              <div className="w-full flex gap-5">
                {selectedRecord && (
                  <div className="w-full flex flex-col gap-5">
                    <div className="flex gap-3 flex-col">
                      <p>Id user:</p>
                      <Input value={selectedRecord._id} readOnly/>
                    </div>
                    <div className="flex gap-3 flex-col">
                      <p>Tên hiển thị:</p>
                      <Input value={selectedRecord.displayname} readOnly/>
                    </div>
                    <div className="flex gap-3 flex-col">
                      <p>Email:</p>
                      <Input value={selectedRecord.email} readOnly/>
                    </div>
                  </div>
                )}
              </div>
            </Modal>
        </div>
    )
}

export default Account;