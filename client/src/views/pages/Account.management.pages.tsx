import { useEffect, useState } from "react";
import { Table, Input, Modal, InputNumber, Select, message, Grid } from 'antd';
import type { TableProps } from 'antd';
import { RESPONSE_CODE } from "../../constants/responseCode.constants";
import Verify from "../components/VerifyToken.components";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL)
const { useBreakpoint } = Grid;

interface Props {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  aLert: NotificationProps
}

interface NotificationProps {
  addNotification: (message: string) => void;
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
  const screens = useBreakpoint();
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));

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

  const language = (): string => {
    const language = localStorage.getItem('language')
    return language ? JSON.parse(language) : "Tiếng Việt"
  }

  const [listuser, setListuser] = useState<User[]>([]);
  const [data, setDataUser] = useState<DataType[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalActiveOpen, setIsModalActiveOpen] = useState(false);
  const [hours, setHours] = useState<number|null>(1);
  const [timeUnit, setTimeUnit] = useState("h");
  const [banReason, setBanReason] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  // useEffect(() => {
  //   return () => {}
  // }, [refresh_token, messageApi])

  useEffect(() => {
    socket.emit('connect-admin-realtime', refresh_token)
    socket.on('ban-account', (data) => {
      console.log(data)
      messageApi.open({
        type: 'error',
        content: `Admin đã ban 1 tài khoản với lý do ${data.reason}!`,
      })
      props.aLert.addNotification(`Admin đã ban 1 tài khoản với lý do ${data.reason}!`)
      setListuser(prevList => {
        return prevList.map(user => {
          if(user._id === data.user_id) {
            return {
              ...user,
              penalty: {
                created_by: data.created_by,
                expired_at: data.expired_at,
                reason: data.reason
              }
            };
          }
          return user;
        });
      });
    })

    socket.on('unban-account', (res) => {
      console.log(res)
      messageApi.open({
        type: 'success',
        content: `Tài khoản ${res.user_id} đã được mở khoá!`,
      })
      props.aLert.addNotification(`Tài khoản ${res.user_id} đã được mở khoá!`)
    })

    return () => {
      socket.off('ban-account')
      socket.off('unban-account')
    }
  }, [refresh_token, listuser, messageApi])

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
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          handleActiveCancel();
          props.setLoading(true);
          try {
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
              if(data.code == RESPONSE_CODE.UNBAN_ACCOUNT_FAILED){
                messageApi.open({
                  type: 'error',
                  content: data.message,
                })
                return;
              }
              // Nếu không có lỗi thì mở thông báo thành công
              if(data.code == RESPONSE_CODE.UNBAN_ACCOUNT_SUCCESSFUL){
                messageApi.open({
                  type: 'success',
                  content: 'Mở khóa tài khoản thành công',
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
                  })
                })
              }
            })
          } catch (error) {
            messageApi.open({
              type: 'error',
              content: String(error),
              style: {
                marginTop: '10vh',
              },
            })
            return;
          } finally {
            setTimeout(() => {
              props.setLoading(false)
            }, 4000)
          }
        } else {
          messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
      };
    
      checkToken();
  }

  const handleOk = (id: string) => {
    if (hours === null || hours < 1) {
      messageApi.open({
        type: 'error',
        content: 'Số giờ ban phải lớn hơn 1',
      });
      return;
    }
    if (!banReason.trim()) {
      messageApi.open({
        type: 'error',
        content: 'Không được để trống lý do ban',
      })
      return;
    }

    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          handleCancel();
          props.setLoading(true);
          try {
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
              if(data.code == RESPONSE_CODE.BAN_ACCOUNT_FAILED){
                messageApi.open({
                  type: 'error',
                  content: data.message,
                })
                return;
              }
              if(data.code == RESPONSE_CODE.BAN_ACCOUNT_SUCCESSFUL){
                messageApi.open({
                  type: 'success',
                  content: data.message,
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
                  })
                }) 
              }
            })
          }
          catch (error) {
            messageApi.open({
              type: 'error',
              content: String(error),
              style: {
                marginTop: '10vh',
              },
            })
            return;
          } finally {
            setTimeout(() => {
              props.setLoading(false)
            }, 4000)
          }
        } else {
          messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
      };
      checkToken();
  };

  const handleActiveCancel = () => {
    setIsModalActiveOpen(false);
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
    })
  }, [refresh_token, access_token])

  useEffect(() => {
    const newData = listuser.map((user, index) => ({
      key: String(index + 1),
      _id: user._id,
      displayname: user.display_name,
      email: user.email,
      phone: user.phone,
      role: user.role === 3
        ? "Admin"
        : user.role === 2
          ? "Shipper"
          : user.role === 1
            ? "Employee"
            : language() == "Tiếng Việt"
              ? "Khách hàng"
              : "Customer",
      active: user.penalty
        ? (language() == "Tiếng Việt"
          ? "Bị ban"
          : "Banned")
        : (language() == "Tiếng Việt"
          ? "Hoạt động"
          : "Active"),
      readson: user.penalty !== null
        ? user.penalty?.reason
        : language() == "Tiếng Việt"
          ? "Không có lý do"
          : "No reason",
      note: [language() == "Tiếng Việt" ? "Khóa tài khoản" : "Lock account"],
    }));
  
    setDataUser(newData);
  }, [listuser]);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: language() == "Tiếng Việt" ? 'Tên hiển thị' : 'Display Name',
      dataIndex: 'displayname',
      key: 'displayname',
      width: screens.lg ? 350 : 150,
      render: (text) => <p className="font-bold">{text}</p>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: screens.lg ? 250 : 150,
      key: 'email',
    },
    {
      title: language() == "Tiếng Việt" ? 'Số điện thoại' : 'Phone Number',
      dataIndex: 'phone',
      width: screens.lg ? 350 : 150,
      key: 'phone',
    },
    {
      title: language() == "Tiếng Việt" ? 'Quyền hạn' : 'Role',
      key: 'role',
      dataIndex: 'role',
      width: screens.lg ? 250 : 100,
    },
    {
      title: language() == "Tiếng Việt" ? 'Tình trạng' : 'Status',
      key: 'active',
      dataIndex: 'active',
      width: screens.lg ? 250 : 120,
      render: (text) => <p className={text === "Hoạt động" || text === "Active" ? "text-green-500 bg-green-200 p-2 flex justify-center rounded-xl" : "text-red-500 bg-red-200 p-2 flex justify-center rounded-xl"}>{text}</p>,
    },
    {
      title: '',
      key: 'note',
      dataIndex: 'note',
      width: screens.lg ? 250 : 120,
      render: (_text, record) => {
        const isDisabled = record.role === "Admin";
        return (
          <>
            {record.active == "Hoạt động" || record.active == "Active" ? record.note.map((noteitem, index) => (
              <button key={index}
                className={`${isDisabled ? "bg-gray-500" : "bg-red-500 hover:bg-red-700 cursor-pointer"} transition duration-300 text-white font-semibold p-2 rounded`}
                onClick={() => showModal(record)} disabled={isDisabled}>
                {noteitem}
              </button>
            )) :
              <button key={1}
                className="bg-green-500 cursor-pointer hover:bg-green-700 transition duration-300 text-white font-semibold p-2 rounded"
                onClick={() => showActiveModal(record)} disabled={isDisabled}>
                {language() == "Tiếng Việt" ? "Mở khoá" : "Unlock"}
              </button>
            }
          </>
        )
      },
    },
  ];
  
  const App: React.FC = () => <Table<DataType> className="w-full" columns={columns} dataSource={data} pagination={{ pageSize: 25 }} scroll={!screens.lg ? { x: true } : undefined}/>;
    
    return(
        <div className="p-4 md:p-6 lg:p-10">
            {contextHolder}
            <div className="w-full flex justify-center flex-col gap-5 md:gap-8 lg:gap-10 items-center">
              <div className="w-full flex justify-center flex-col items-center gap-3 md:gap-5">
                <div className="w-full overflow-x-auto">
                  <App />
                </div>
              </div>
            </div>
            <Modal width={screens.lg ? '50%' : '90%'} title={language() == "Tiếng Việt" ? "Ban tài khoản" : "Ban account"} open={isModalOpen} okText="Ban tài khoản" onOk={() => handleOk(`${selectedRecord ? selectedRecord._id : ""}`)} onCancel={handleCancel}>
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
            <Modal width={screens.lg ? '50%' : '90%'} title={language() == "Tiếng Việt" ? "Mở khoá tài khoản" : "Active account"} open={isModalActiveOpen} okText="Mở khoá" onOk={() => handleActiveOk(`${selectedRecord ? selectedRecord._id : ""}`)} onCancel={handleActiveCancel}>
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