import { JSX, useEffect, useState } from "react";
import { Table, Input, Button, Modal, InputNumber, message } from 'antd';
import type { TableProps } from 'antd';

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


const CategoryManagement = (): JSX.Element => {
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
      console.log(data)
      if(data) {
        messageApi.success(data.message).then(() => {
          setShowEditModal(false)
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
            console.log(data)
          })
        })
      }
    })
  }

  const handleDelete = (id: string) => { 
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
      console.log(data)
      if(data) {
        setShowDeleteModal(false)
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
          console.log(data)
        })
      }
    })
  }

  const CreateCategory = () => { 
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
      console.log(data)
      if(data) {
        messageApi.success(data.message).then(() => {
          setShowCreateModal(false)
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
            console.log(data)
          })
        })
      }
    })
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
      console.log(data)
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
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 350,
      render: (text) => <p className="font-bold">{text}</p>,
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      width: 350,
      key: 'priority',
    },
    {
      title: 'Chỉnh sửa',
      key: 'note',
      width: 350,
      render: (_text, record) => {
        return (
          <div className="flex gap-2">
            <Button style={{ background:"blue", color:"white" }} onClick={() => showEditModalFunc(record)}>{language() == "Tiếng Việt" ? "Chỉnh sửa" : "Edit"}</Button>
            <Button style={{ background:"red", color:"white" }} onClick={() => showDeleteModalFunc(record)}>{language() == "Tiếng Việt" ? "Xoá" : "Delete"}</Button>
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

  const App: React.FC = () => <Table<DataType> className="w-full" columns={columns} dataSource={dataView} pagination={{ pageSize: 25 }} />; 
    return(
        <div className="p-10">  
            {contextHolder} 
            <div className="w-full flex justify-center flex-col gap-10 items-center">
                <div className="w-full flex justify-center flex-col items-cente gap-5">
                    <div className="w-full flex justify-between items-end">
                        <Button onClick={showcreate}>{language() == "Tiếng Việt" ? "Tạo danh mục" : "Create"}</Button>
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