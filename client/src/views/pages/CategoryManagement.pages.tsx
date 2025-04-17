import { useEffect, useState } from "react";
import { Table, Input, Button, Modal, InputNumber, message, Grid } from 'antd';
import type { TableProps } from 'antd';
import Verify from "../components/VerifyToken.components";
import { RESPONSE_CODE } from "../../constants/responseCode.constants";
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
    category: string;
    priority: number;
    note: string[],
}

interface Category {
  category_name_translate_1: string;
  category_name_translate_2: string;
  created_at: string;  // ISO date string
  index: number;
  translate_1_language: string;
  translate_2_language: string;
  updated_at: string;  // ISO date string
  _id: string;
}


const CategoryManagement: React.FC<Props> = (props) => {
  const screens = useBreakpoint();
  const [refresh_token, setRefreshToken] = useState<string | null>(localStorage.getItem("refresh_token"));
  const [access_token, setAccessToken] = useState<string | null>(localStorage.getItem("access_token"));
  const [category, setCategory] = useState<Category[]>([])
  const [dataView, setData] = useState<DataType[]>([])
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage();
  const [priority, setPriority] = useState<number|null>(1)
  const [categoryName, setCategoryName] = useState<string>("")
  const [priorityEdit, setPriorityEdit] = useState<number>(selectedRecord ? selectedRecord.priority : 1)
  const [categoryNameEdit, setCategoryNameEdit] = useState<string>(selectedRecord ? selectedRecord.category : "")
  const language = (): string => {
    const Language = localStorage.getItem('language')
    return Language ? JSON.parse(Language) : "Tiếng Việt"
  }

  useEffect(() => {
    socket.emit('connect-guest-realtime')
    socket.on('create-category', (res) => {
      messageApi.info(language() == "Tiếng Việt" ? "Có danh mục mới" : "New category")
      setCategory((prevCategories) => [...prevCategories, res]);
      props.aLert.addNotification(language() == "Tiếng Việt" ? "Có danh mục mới được tạo" : "New category")
    })

    socket.on('delete-category', (res) => {
      messageApi.info(language() == "Tiếng Việt" ? "Có danh mục mới bị xoá" : "New category deleted")
      setCategory(category.filter((item) => item._id !== res._id))
      props.aLert.addNotification(language() == "Tiếng Việt" ? "Có danh mục mới bị xoá" : "New category deleted")
    })

    socket.on('update-category', (res) => {
      messageApi.info(language() == "Tiếng Việt" ? "Có danh mục mới cập nhật" : "New category updated")
      setCategory(category.map((item) => item._id === res._id ? res : item))
      props.aLert.addNotification(language() == "Tiếng Việt" ? "Có danh mục mới cập nhật" : "New category updated")
    })

    return () => {
      socket.off('create-category')
      socket.off('delete-category')
      socket.off('update-category')
    }
  }, [refresh_token, category, messageApi])

  useEffect(() => {
    setCategory(category.sort((a, b) => a.index - b.index))
  }, [category])

  const handleChangePriorityEdit = (e: number|null) => {
    if(e == null) return;
    setPriorityEdit(e);
  }

  const handleChangePriority = (e: number|null) => {
    if(e == null) return;
    setPriority(e);
  }

  const showcreate = () => { 
    setShowCreateModal(true)
  }

  const showDeleteModalFunc = (record: DataType) => {
    setSelectedRecord(record)
    setShowDeleteModal(true)
  }

  const showEditModalFunc = (record: DataType) => {
    setSelectedRecord(record)
    setShowEditModal(true)
  }

  useEffect(() => {
    setCategoryNameEdit(selectedRecord ? selectedRecord.category : "")
    setPriorityEdit(selectedRecord ? selectedRecord.priority : 1)
  }, [selectedRecord])
  
  const handleEdit = (id: string) => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          setShowEditModal(false)
          props.setLoading(true);
          try {
            const body = {
              language: null,
              refresh_token: refresh_token,
              category_id: id,
              category_name: categoryNameEdit,
              index: priorityEdit,
            }
        
            fetch(`${import.meta.env.VITE_API_URL}/api/categories/update`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body)
            }).then((response) => {
              return response.json()
            }).then((data) => {
              if(data.code == RESPONSE_CODE.UPDATE_CATEGORY_FAILED) {
                messageApi.error(data.message)
                return;
              }
              if(data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
                messageApi.error(data.message)
                messageApi.error(data.errors.category_name.msg)
                return;
              }
              if(data.code == RESPONSE_CODE.UPDATE_CATEGORY_SUCCESSFUL) {
                messageApi.success(data.message)
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
                  setCategory(data.categories)
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
            }, 2000)
          }
        } else {
          messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
      };
    
      checkToken();
  }

  const handleDelete = (id: string) => { 
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          setShowDeleteModal(false)
          props.setLoading(true);
          try {
            const body = {
              language: null,
              refresh_token: refresh_token,
              category_id: id,
            }
        
            fetch(`${import.meta.env.VITE_API_URL}/api/categories/delete`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body)
            }).then((response) => {
              return response.json()
            }).then((data) => {
              if(data.code == RESPONSE_CODE.DELETE_CATEGORY_FAILED) {
                messageApi.error(data.message)
                return;
              }
              if(data.code == RESPONSE_CODE.DELETE_CATEGORY_SUCCESSFUL) {
                messageApi.success(data.message)
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
                  setCategory(data.categories)
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
            }, 2000)
          }
        } else {
          messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
      };
    
      checkToken();
  }

  const CreateCategory = () => {
    const checkToken = async () => {
      const isValid = await Verify(refresh_token, access_token);
        if (isValid) {
          setShowCreateModal(false)
          props.setLoading(true);
          try {
            const body = {
              language: null,
              refresh_token: refresh_token,
              category_name: categoryName,
              index: priority
            }
        
            fetch(`${import.meta.env.VITE_API_URL}/api/categories/create`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify(body)
            }).then((response) => {
              return response.json()
            }).then((data) => {
              if(data.code == RESPONSE_CODE.CREATE_CATEGORY_FAILED) {
                messageApi.error(data.message)
                return;
              }
              if(data.code == RESPONSE_CODE.INPUT_DATA_ERROR) {
                messageApi.error(data.message)
                messageApi.error(data.errors.category_name.msg)
                return;
              }
              if(data.code == RESPONSE_CODE.CREATE_CATEGORY_SUCCESSFUL) {
                messageApi.success(data.message)
                setCategoryName("")
                setPriority(1)
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
                  setCategory(data.categories)
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
            }, 2000)
          }
        } else {
          messageApi.error(language() == "Tiếng Việt" ? "Người dùng không hợp lệ" : "Invalid User")
        }
      };
    
      checkToken();
  }

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
      setCategory(data.categories)
    })
  }, [])

  useEffect(() => {
    const newData = category.map((categoryV, index) => ({
      key: String(index + 1),
      _id: categoryV._id,
      category: language() == "Tiếng Việt" ? categoryV.category_name_translate_1 : categoryV.category_name_translate_1,
      priority: categoryV.index,
      note: ["Chỉnh sửa", "Xoá"],
    }))

    setData(newData);
  }, [category])

  const columns: TableProps<DataType>['columns'] = [
    {
      title: language() == "Tiếng Việt" ? 'Danh mục' : 'Category',
      dataIndex: 'category',
      key: 'category',
      width: screens.md ? 350 : 150,
      render: (text) => <p className="font-bold">{text}</p>,
    },
    {
      title: language() == "Tiếng Việt" ? 'Độ ưu tiên' : 'Priority',
      dataIndex: 'priority',
      width: screens.md ? 350 : 100,
      key: 'priority',
    },
    {
      title: language() == "Tiếng Việt" ? 'Chỉnh sửa' : 'Edit',
      key: 'note',
      width: screens.md ? 350 : 150,
      render: (_text, record) => {
        return (
          <div className="flex gap-2">
            <button
              className="bg-blue-500 cursor-pointer hover:bg-blue-700 transition duration-300 text-white font-semibold py-2 px-4 rounded"
              onClick={() => showEditModalFunc(record)}
            >
              {language() == "Tiếng Việt" ? "Chỉnh sửa" : "Edit"}
            </button>
            <button className="bg-red-500 cursor-pointer hover:bg-red-700 transition duration-300 text-white font-semibold py-2 px-4 rounded"
              onClick={() => showDeleteModalFunc(record)}
            >
              {language() == "Tiếng Việt" ? "Xoá" : "Delete"}
            </button>
          </div>
        )
      },
    },
  ];

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

  const App: React.FC = () => <Table<DataType> className="w-full" scroll={!screens.md ? { x: true } : undefined} columns={columns} dataSource={dataView} pagination={{ pageSize: 25 }} />; 
    return(
        <div className="p-4 md:p-10">  
            {contextHolder} 
            <div className="w-full flex justify-center flex-col gap-5 md:gap-10 items-center">
              <div className="w-full flex justify-center flex-col items-center gap-5">
                <div className="w-full flex justify-between items-end">
                  <Button 
                    type="primary"
                    size={screens.md ? "middle" : "small"}
                    onClick={showcreate}
                  >
                    {language() == "Tiếng Việt" ? "Tạo danh mục" : "Create"}
                  </Button>
                </div>
                <div className="w-full overflow-x-auto">
                  <App />
                </div>
              </div>
            </div>
            <Modal title={language() == "Tiếng Việt" ? "Tạo danh mục" : "Create category"} open={showCreateModal} okText="Tạo danh mục" onOk={() => CreateCategory()} onCancel={() => setShowCreateModal(false)}>
              <div className="w-full flex flex-col gap-5">
                <div className="flex gap-3 flex-col">
                    <p>Tên danh mục:</p>
                    <Input 
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      min={1}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="flex gap-3 flex-col">
                  <p>Độ ưu tiên:</p>
                  <div className="flex gap-3">
                    <InputNumber
                      onChange={handleChangePriority}
                      value={priority}
                      min={1}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </Modal>
            <Modal title={language() == "Tiếng Việt" ? "Chỉnh sửa danh mục" : "Change category"} open={showEditModal} okText="Cập nhật danh mục" onOk={() => handleEdit(`${selectedRecord ? selectedRecord._id : ""}`)} onCancel={() => setShowEditModal(false)}>
                {selectedRecord && (
                <div className="w-full flex flex-col gap-5">
                  <div className="flex gap-3 flex-col">
                  <p>Tên danh mục:</p>
                  <Input 
                    value={categoryNameEdit}
                    onChange={(e) => setCategoryNameEdit(e.target.value)}
                    min={1}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                  />
                  </div>
                  <div className="flex gap-3 flex-col">
                    <p>Độ ưu tiên:</p>
                    <div className="flex gap-3">
                      <InputNumber
                        onChange={handleChangePriorityEdit}
                        value={priorityEdit}
                        min={1}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
                )}
            </Modal>
            <Modal title={language() == "Tiếng Việt" ? "Xác nhận xoá danh mục" : "Confirm delete category"} open={showDeleteModal} okText="Xoá danh mục" onOk={() => handleDelete(`${selectedRecord ? selectedRecord._id : ""}`)} onCancel={() => setShowDeleteModal(false)}>
                <p>{language() == "Tiếng Việt" ? "Bạn có chắc chắn muốn xoá danh mục này không?" : "Are you sure you want to delete this category?"}</p>
            </Modal>
        </div>
    )
}

export default CategoryManagement;